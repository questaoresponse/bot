const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth() // Armazena login localmente
});

// client.on('qr', qr => {
//     qrcode.generate(qr, { small: true });
// });

client.on('ready', () => {
    console.log('Bot está pronto!');
});

client.on('message', async message => {
    switch (message.body){
        case "!menu":
            message.reply(`!responde: Responde algo
!quem eu sou: responde quem você é
!calcular: no formato (x,y)(x,y), calcula a cara da função afim
            `);
            break;
        case "!responde":
            message.reply("N sou obrigado n");
            break;
        case "!quem eu sou":
            message.reply("me diga com quem tu andas que eu digo quem tu eres");
    }
    if (message.body.startsWith("!send")){
        const p=message.body.split(" ");
        if (p.length==3){
            const message=p[3].slice(1, -1);
            const mentions = await message.getMentions();
            mentions.forEach(mention => {
                client.sendMessage(mention.id._serialized,message);
            });
        } else {
            message.reply("Formato inválido. Verifique sua mensagem e tente novamente.")
        }
    } else if (message.body.startsWith("!calcular")){
        try {
            const expressao=message.body.split(" ")[1];
            const ps=expressao.split(")(");
            const p1=ps[0].split(",");
            const p2=ps[1].split(",");
            const xa=p1[0].replace("(","");
            const ya=p1[1];
            const xb=p2[0];
            const yb=p2[1].replace(")","");
            var pares=[[Number(xa),Number(ya)],[Number(xb),Number(yb)]];
            pares=pares.sort((a,b)=>b[0]-a[0]);
            const a=(pares[0][1] - pares[1][1]) / (pares[0][0] - pares[1][0]);
            const b=pares[0][1] - a * pares[0][0];
            message.reply(`a = (${pares[0][1]} - ${pares[1][1]}) / (${pares[0][0]} - ${pares[1][0]})
f(x) = ${ a == 1 ? "x" : String(a)+"x" } ${b >= 0 ? "+" : "-"} ${Math.abs(b)}
            `);
        } catch (e){
            console.log(e);
            message.reply("Ocorreu um erro ao calcular. Verifique sua resposta");
        }
    }
});

client.initialize();
