// const os = require('os');
// const fs = require('fs');
// //const clipboardy = require('clipboardy');

// const getLocalIP = () => {
//     const interfaces = os.networkInterfaces();
//     for (const devName in interfaces) {
//         const iface = interfaces[devName];

//         for (let i = 0; i < iface.length; i++) {
//             const alias = iface[i];
//             if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
//                 return alias.address;
//             }
//         }
//     }
//     return '0.0.0.0';
// };

// const ip = `http://${getLocalIP()}:3001\n`;
// fs.writeFileSync('/home/lunkwill/Documents/obsidyen/myIP.md', ip);
// //clipboardy.writeSync(ip);
// console.log('IP address saved to ip_address.txt');


// (async () => {
//     const clipboardy = await import('clipboardy');
//     clipboardy.writeSync(ip);
//     console.log('IP address saved to ip_address.txt and copied to clipboard');
// })();






const os = require('os');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];

        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '0.0.0.0';
};

const homeDirectory = os.homedir();

// Construct the file path
const filePath = path.join(homeDirectory, '/Documents/obsidyen/myIP.md');
const ip = `http://${getLocalIP()}:3001\n`;
fs.writeFileSync(filePath, ip);

try {
    execSync(`echo ${JSON.stringify(ip)} | xclip -selection clipboard`);
    console.log('IP address saved to ip_address.txt and copied to clipboard');
} catch (error) {
    console.error('Failed to copy to clipboard:', error);
}