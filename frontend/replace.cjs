const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('C:/Users/hp/Desktop/consignmentSite/frontend/src/components');
// Also include App.jsx just in case
files.push('C:/Users/hp/Desktop/consignmentSite/frontend/src/App.jsx');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    // Ordered safely to prevent collisions
    content = content.replace(/blue-950/g, 'slate-950');
    content = content.replace(/blue-900/g, 'slate-950');
    content = content.replace(/blue-800/g, 'slate-950');
    content = content.replace(/blue-700/g, 'slate-950');
    content = content.replace(/blue-600/g, 'slate-900');
    content = content.replace(/blue-500/g, 'slate-800');
    content = content.replace(/blue-400/g, 'slate-600');
    content = content.replace(/blue-300/g, 'slate-400');
    content = content.replace(/blue-200/g, 'slate-300');
    content = content.replace(/blue-100/g, 'slate-200');
    content = content.replace(/blue-50/g, 'slate-100');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
