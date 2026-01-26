const fs = require('fs');
const path = require('path');

// 要处理的文档目录
const docsDir = path.join(__dirname, '../docs');

// 递归处理所有.md文件
function processMarkdownFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      processMarkdownFiles(filePath);
    } else if (path.extname(file) === '.md') {
      processMarkdownFile(filePath);
    }
  });
}

// 处理单个Markdown文件，移除Params和Return部分
function processMarkdownFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
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
