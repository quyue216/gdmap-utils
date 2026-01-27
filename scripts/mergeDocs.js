const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '../docs');
const srcDir = path.join(__dirname, '../src');
const outputFile = path.join(docsDir, 'COMPLETE_API.md');

// 读取README.md作为文档头部
const readmePath = path.join(docsDir, 'README.md');
let readmeContent = '';
if (fs.existsSync(readmePath)) {
  readmeContent = fs.readFileSync(readmePath, 'utf8');
}

// 要处理的源文件
const sourceFiles = [
  {
    path: path.join(srcDir, 'layers', 'baseMarkerLayer', 'index.ts'),
    name: 'BaseMarkerLayer'
  },
  {
    path: path.join(srcDir, 'layers', 'clusterMarkerLayer', 'index.ts'),
    name: 'ClusterMarkerLayer'
  }
];

// 从TypeScript源文件中提取文档注释
function extractDocumentationFromSource(filePath, className) {
  const content = fs.readFileSync(filePath, 'utf8');
  let documentation = '';
  
  // 提取类文档注释
  const classCommentMatch = content.match(/\/\*\*[\s\S]*?\*\/\s*class\s+\w+/);
  if (classCommentMatch) {
    documentation += classCommentMatch[0].replace(/class\s+\w+/, '') + '\n\n';
  }
  
  // 提取构造函数
  const constructorMatch = content.match(/constructor\s*\([^)]*\)\s*\{/);
  if (constructorMatch) {
    let constructorStr = constructorMatch[0].replace(/\{/, '');
    // 移除类型注解
    constructorStr = constructorStr.replace(/:\s*[^,]+/g, '');
    documentation += '## Constructors\n\n';
    documentation += '### Constructor\n';
    documentation += `> **new ${className}**${constructorStr}\n\n`;
  }
  
  // 提取属性（去重）
  const propertiesMatch = content.match(/\w+:\s*[^;]+;/g);
  if (propertiesMatch) {
    const uniqueProps = [...new Set(propertiesMatch.map(prop => prop.match(/\w+/)[0]))];
    documentation += '## Properties\n\n';
    uniqueProps.forEach(propName => {
      documentation += `### ${propName}\n`;
      documentation += `> **${propName}**\n\n`;
    });
  }
  
  // 提取方法
  const methodMatch = content.match(/\w+\s*\([^)]*\)\s*[:{]/g);
  if (methodMatch) {
    documentation += '## Methods\n\n';
    methodMatch.forEach(method => {
      const methodName = method.match(/\w+/)[0];
      if (methodName !== 'constructor') {
        let methodStr = method.replace(/:\s*$/, '');
        // 移除类型注解
        methodStr = methodStr.replace(/:\s*[^,]+/g, '');
        documentation += `### ${methodName}\n`;
        documentation += `> **${methodName}**${methodStr.replace(methodName, '')}\n\n`;
      }
    });
  }
  
  return documentation;
}

// 合并所有文档
function mergeDocs() {
  console.log('开始合并文档...');
  
  // 构建文档内容
  let mergedContent = '';
  
  // 添加README内容
  if (readmeContent) {
    mergedContent += readmeContent + '\n\n';
    mergedContent += '---\n\n';
    mergedContent += '# API 文档\n\n';
  }
  
  // 添加目录
  mergedContent += '## 目录\n\n';
  sourceFiles.forEach(file => {
    mergedContent += `- [${file.name}](#${file.name.toLowerCase()})\n`;
  });
  mergedContent += '\n---\n\n';
  
  // 添加各个文档内容
  sourceFiles.forEach(file => {
    const documentation = extractDocumentationFromSource(file.path, file.name);
    
    mergedContent += `## ${file.name}\n\n`;
    mergedContent += `<a id="${file.name.toLowerCase()}"></a>\n\n`;
    mergedContent += documentation + '\n\n';
    mergedContent += '---\n\n';
  });
  
  // 移除末尾多余的分隔符
  mergedContent = mergedContent.replace(/\n*\*\*\n*$/, '');
  
  // 添加生成信息
  mergedContent += '\n\n---\n\n';
  mergedContent += `*最后更新时间: ${new Date().toLocaleString('zh-CN')}*`;
  
  // 写入合并后的文档
  fs.writeFileSync(outputFile, mergedContent, 'utf8');
  console.log(`文档合并完成: ${outputFile}`);
  console.log(`总字数: ${mergedContent.length}`);
}

// 执行合并
try {
  mergeDocs();
} catch (error) {
  console.error('文档合并失败:', error);
  process.exit(1);
}