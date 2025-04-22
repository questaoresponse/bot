const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { DateTime } = require("luxon");

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

!send: envie uma mensagem para alguém do grupo no privado no seguinte formato: !send <Marcar @> <mensagem>

!angendar: semelhante ao !send, porém agenda uma mensagem, no seguinte formato: !agendar 2025-04-22 00:00:00 <Marcar @> <mensagem>

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
        var error=false;
        if (p.length >= 3){
            const mentions = await message.getMentions();
            if (mentions.length > 0){
                const message_to_send=p.splice(1 + mentions.length).join(" ");
                mentions.forEach(mention => {
                    client.sendMessage(mention.id._serialized,message_to_send);
                });
            } else {
                error = true;
            }
        } else {
            error = true;
        }
        if (error) message.reply("Formato inválido. Verifique sua mensagem e tente novamente.")
    } else if (message.body.startsWith("!agendar")){
        const p=message.body.split(" ");
        var error=false;
        if (p.length >= 4){
            try {
                const date_string=p[1] + " " + p[2];
                const diff = DateTime.fromFormat(date_string, "yyyy-MM-dd HH:mm:SS", {zone: "America/Sao_Paulo"}).toMillis() - DateTime.now().setZone("America/Sao_Paulo").toMillis();
                console.log(diff,DateTime.fromFormat(date_string, "yyyy-MM-dd HH:mm:SS", {zone: "America/Sao_Paulo"}).toMillis(),new Date(date_string).getTime());
                const mentions = await message.getMentions();
                if (mentions.length > 0){
                    const message_to_send=p.splice(3 + mentions.length).join(" ");
                    setTimeout(()=>mentions.forEach(mention => {
                        client.sendMessage(mention.id._serialized,message_to_send);
                    }), diff);
                } else {
                    error = true;
                }
            } catch (e){
                error = true;
            }
        } else {
            error = true;
        }
        if (error) message.reply("Formato inválido. Verifique sua mensagem e tente novamente.")
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
            message.reply("Ocorreu um erro ao calcular. Verifique sua resposta");
        }
    }
});

client.initialize();
