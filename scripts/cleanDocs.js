const fs = require('fs');
const path = require('path');

// 要处理的文档目录
const docsDir = path.join(__dirname, '../docs');
// 源代码目录
const srcDir = path.join(__dirname, '../src');

// 从TypeScript源文件中提取方法参数类型
function extractMethodParamTypes() {
  const paramTypes = {};
  
  // 递归遍历源代码文件
  function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        traverseDir(filePath);
      } else if (path.extname(file) === '.ts') {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 按行读取文件内容
        const lines = content.split('\n');
        let currentMethod = null;
        let currentParams = [];
        let inMethod = false;
        
        lines.forEach(line => {
          // 检查是否是方法定义的开始
          const methodStartMatch = line.match(/(?:public|private|protected)?\s*(\w+)\s*<[^>]*>?\s*\(([^)]*)\)\s*(?::\s*([^\{]+))?\s*(?:\{|=>)/);
          
          if (methodStartMatch) {
            // 如果之前有正在处理的方法，保存它
            if (currentMethod && currentParams.length > 0) {
              paramTypes[currentMethod] = currentParams;
            }
            
            // 开始处理新方法
            currentMethod = methodStartMatch[1];
            currentParams = [];
            inMethod = true;
            
            // 提取当前行的参数
            const paramsStr = methodStartMatch[2];
            if (paramsStr && paramsStr.trim() !== '') {
              const params = paramsStr.split(',').map(param => {
                const paramMatch = param.trim().match(/(\w+)\s*:\s*([^=]+)/);
                if (paramMatch) {
                  return {
                    name: paramMatch[1],
                    type: paramMatch[2].trim()
                  };
                }
                return null;
              }).filter(Boolean);
              
              currentParams = currentParams.concat(params);
            }
          } else if (inMethod) {
            // 检查是否是方法定义的结束
            if (line.trim() === '{' || line.trim() === '};') {
              // 保存当前方法
              if (currentMethod && currentParams.length > 0) {
                paramTypes[currentMethod] = currentParams;
              }
              
              currentMethod = null;
              currentParams = [];
              inMethod = false;
            } else {
              // 提取跨多行的参数
              const paramMatch = line.trim().match(/(\w+)\s*:\s*([^=]+)/);
              if (paramMatch) {
                currentParams.push({
                  name: paramMatch[1],
                  type: paramMatch[2].trim()
                });
              }
            }
          }
        });
        
        // 保存最后一个方法
        if (currentMethod && currentParams.length > 0) {
          paramTypes[currentMethod] = currentParams;
        }
      }
    });
  }
  
  traverseDir(srcDir);
  
  // 添加硬编码的参数类型映射，为那些难以通过正则表达式提取的方法提供类型信息
  const hardcodedParamTypes = {
    'removeLayer': [{ name: 'layer', type: 'BaseMarkerLayerIns | ClusterMarkerLayerIns' }],
    'setFitView': [{ name: 'opts', type: 'Parameters<mapIns[\'setFitView\']>' }],
    'seZoomAndCenter': [{ name: 'opts', type: '{ zoom: number; center: AMap.LngLat | [number, number]; immediately?: boolean; duration?: number }' }]
  };
  
  // 合并硬编码的参数类型映射
  Object.assign(paramTypes, hardcodedParamTypes);
  
  return paramTypes;
}

// 递归处理所有.md文件
function processMarkdownFiles(dir) {
  const files = fs.readdirSync(dir);
  const paramTypes = extractMethodParamTypes();
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      processMarkdownFiles(filePath);
    } else if (path.extname(file) === '.md') {
      processMarkdownFile(filePath, paramTypes);
    }
  });
}

// 在分类标题后添加描述文字
function addCategoryDescription(content) {
  // 定义分类描述映射
  const categoryDescriptions = {
    '高德地图工具': '本分类封装了高德地图（AMap）的核心功能，包括标记点、图标、折线、信息窗口等常用地图元素的创建和管理。这些静态方法提供了便捷的API，帮助开发者快速构建地图应用。'
  };
  
  // 遍历所有分类，添加描述文字
  Object.keys(categoryDescriptions).forEach(category => {
    const regex = new RegExp(`##\\s*${category}\\s*\\n`, 'g');
    content = content.replace(regex, `## ${category}\n\n${categoryDescriptions[category]}\n\n`);
  });
  
  return content;
}

// 处理单个Markdown文件，移除Params和Return部分，并添加参数类型
function processMarkdownFile(filePath, paramTypes) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 在分类标题后添加描述文字
  content = addCategoryDescription(content);
  
  // 移除Params部分
  content = content.replace(/#### Parameters[\s\S]*?(?=#### Returns|\*\*\*|$)/g, '');
  
  // 移除Returns部分
  content = content.replace(/#### Returns[\s\S]*?(?=####|\*\*\*|$)/g, '');
  
  // 移除Memberof部分
  content = content.replace(/#### Memberof[\s\S]*?(?=####|\*\*\*|$)/g, '');
  
  // 移除Type Parameters部分（包含#### Type Parameters标题和后续的所有参数行）
  content = content.replace(/#### Type Parameters[\s\S]*?(?=\*\*\*|$)/g, '');
  
  // 移除单独的Type Parameter行（如##### U, ##### T等）
  content = content.replace(/#####\s+\w+[\s\S]*?(?=#####|\*\*\*|$)/g, '');
  
  // 移除单独的Type Parameter描述行（如`U` *extends* `object`）
  content = content.replace(/`\w+`\s*\*extends\*\s*`[^`]+`[^\n]*\n/g, '');
  
  // 为方法参数添加类型信息
  content = content.replace(/(###\s+(\w+)\(\)[\s\S]*?>\s*\*\*\w+\*\*\s*)\(([^)]*)\)(:\s*`[^`]+`)/g, (match, prefix, methodName, paramsStr, returnType) => {
    if (paramTypes[methodName]) {
      const params = paramTypes[methodName];
      let newParamsStr = '';
      
      params.forEach((param, index) => {
        if (index > 0) {
          newParamsStr += ', ';
        }
        newParamsStr += `${param.name}: ${param.type}`;
      });
      
      return `${prefix}(${newParamsStr})${returnType}`;
    }
    return match;
  });
  
  // 处理带有反引号的参数
  content = content.replace(/###\s+(\w+)\(\)[\s\S]*?>(\s*\*\*\w+\*\*\s*)\(`([^`]+)`\)(:\s*`[^`]+`)/g, (match, methodName, prefix, paramName, returnType) => {
    if (paramTypes[methodName]) {
      const params = paramTypes[methodName];
      let newParamsStr = '';
      
      params.forEach((param, index) => {
        if (index > 0) {
          newParamsStr += ', ';
        }
        newParamsStr += `${param.name}: ${param.type}`;
      });
      
      return match.replace(/\(`[^`]+`\)/, `(${newParamsStr})`);
    }
    return match;
  });
  
  // 移除多余的换行
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // 移除分隔线前的多余换行
  content = content.replace(/\n+\*\*\*/g, '\n***');
  
  // 移除多余的分隔线
  content = content.replace(/\*\*\*\n\*\*\*/g, '***');
  
  // 保存处理后的内容
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed: ${filePath}`);
}

// 执行处理
processMarkdownFiles(docsDir);
console.log('All markdown files processed successfully!');
