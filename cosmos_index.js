//Dependências Padrões
const Discord = require("discord.js");
const cosmos_client = new Discord.Client();
const cosmos_cfg = require("./cosmos_cfg.json"); //Predefinições do bot

//Adicional
const jimp = require('jimp');
const FS = require('fs');

cosmos_client.on("ready", () => {

    console.log(`${cosmos_client.user.tag} is online 🍄`);
    cosmos_client.user.setActivity(`c.help | Mario Network`,{url:"https://www.twitch.tv/ningamertv"},{type:'STREAMING'})
});

cosmos_client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

cosmos_client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

cosmos_client.on('message', async msg => {

    //Não interagir caso...
    if(msg.author.bot) return; //Seja mensagens de outros bots
    if(msg.channel.type === "dm") return; //DMS

    //Lembrar canal onde mensagem foi enviada
    const msg_channel = msg.channel;

    //Eventos (Sem prefixo) -------------------------------------

    //Canal: #uni-courses
    /*if(msg.channel.id === '621335308449087508' || msg.channel.id === '621335308449087508'){

        //SE for um anexo...
        if(msg.attachments.first())
            msg.react('⭐');
        else
            msg.delete();
    }*/

    //Comandos (com prefixo) ------------------------------------
    if(msg.content.startsWith(cosmos_cfg.prefix) === true){

        //Dividir argumentos, sem comando ou prefixos (Array)
        var args = msg.content.slice(cosmos_cfg.prefix.length).trim().split(/ +/g);

        //Deixa todos argumentos do comando em minusculo
        var cmds = args.shift().toLowerCase();

        //Registrar se alguem utilizoualgum comando
        console.log(`${msg.author.username+'#'+msg.author.discriminator} used command "${cmds}", Arguments: ${args}`);
    }
    else
        cmds = '';

    //+++ Funções +++
    function myattach_get(url_arg_position){

        let _match = msg.author.avatarURL; 

        //Anexo
        if(msg.attachments.first())
            _match = msg.attachments.first().url;
        else{

            if(args.length > url_arg_position){

                //Membros mencionado
                if(msg.mentions.users.first())
                    _match = msg.mentions.users.first().avatarURL;
                else{

                    //Link
                    if(args[url_arg_position].startsWith('http') === true)
                        _match = args[url_arg_position];
                }
            }
        }
        return _match;
    }

    function mytimestampdate(timestamp){

        var date = new Date(timestamp);
        //---------
        var hours = date.getUTCHours();
        var minutes = date.getUTCMinutes();
        var seconds = date.getUTCSeconds();
        var day = date.getUTCDate();
        var month = date.getUTCMonth()+1;
        var year = date.getUTCFullYear();
        //---------
        return hours+':'+minutes+':'+seconds+' - '+day+'/'+month+'/'+year;
    }

    //Avatar
    /*if(cmds === 'avatar'){

        msg.reply(msg.author.avatarURL);
    };*/

    //⚙️ [UTILITY]
    {
        if(cmds === 'help'){

            let _myembed = new Discord.RichEmbed()
            .setColor('#7300FE')
            .setTitle('Command List')
            .setThumbnail('https://i.imgur.com/2jhKFgu.png')
            .addField('⚙️ UTILITY', '**__c.help__** | **c.ping** | **c.invite**\n **c.member** ``@profile``',false)
            .addField('📥 DOWNLOADS', "**c.download** ``Title``\n **__Titles:__** ``2DUniverse`` | ``UniMaker`` | ``Ninty``",false)
            .addField('⭐ QUOTE', "**c.quote** ``Character``, ``Text``\n **__Characters:__** ``Mario`` | ``Luigi`` | ``Peach`` | ``Daisy`` | ``Rosalina`` | ``Yoshi`` | ``Toad`` | ``Toadette`` | ``Toadsworth`` | ``Elvin`` | ``Cranky`` | ``Wario`` | ``Waluigi`` | ``Pauline`` | ``Cappy`` | ``Bowser`` | ``BowserJr`` | ``DryBowser`` | ``ShyGuy`` | ``Geno`` | ``Shigeru``",false)
            .addField('🕹 BOX ARTS', "**c.boxart** ``Console``, ``Attachment/URL``\n **__Consoles:__** ``Switch`` | ``WiiU`` | ``Wii`` | ``GameCube`` | ``N64`` | ``SNES`` | ``3DS`` | ``DS`` | ``GBA`` | ``GBC`` | ``GameBoy``  | ``3DSDark`` | ``WiiUDark`` | ``WiiRed`` | ``N64eu`` | ``GBAeu`` | ``VirtualBoy`` | ``SuperFamicom``",false)
            .addField('✏️ CUSTOM', "**__Note:__** You must provide an ``Attachment/URL`` in order to use one of these commands.\n **c.mirror** | **c.parental** | **c.computer** | **c.level** | **c.gun**",false)
            .addField('📁 FILES', "**c.drake** | **c.arrombados** | **c.fraga** | **c.fanfic** | **c.daniru** | **c.canela** | **c.sources** | **c.mansplaining** | **c.elvingado** | **c.massa**s | **c.bitsvoadores** | **c.fresh** | **c.mariostar** | **c.himarck**",false)
            .addField('💬 TEXT', "**c.ofensafoda** | **c.molek**",false);
            msg_channel.send(_myembed);
        }

        if(cmds === 'ping') {

            //Enviar mensagem no canal (Sync)
            const _ping = await msg.channel.send(". . .");

            //Alterar mensagem enviada e colocar resultado da latencia
            _ping.edit(`🏓 Host: ${_ping.createdTimestamp - msg.createdTimestamp}ms  / API: ${Math.round(cosmos_client.ping)}ms`);
        };

        if(cmds === 'invite'){

            let _myembed = new Discord.RichEmbed()
            .setColor('#7300FE')
            .setTitle('Server Invites')
            .setThumbnail('https://i.imgur.com/TXLStqg.png')
            .addField('🏠 Local', "• https://invite.gg/marionetwork \n• https://discord.me/marionetwork \n• https://disli.st/mario",false)
            .addField('💜 Affiliates', "• <#529238931166724107> \n• https://goo.gl/F1qAGb",false);
            msg_channel.send(_myembed);
        }

        if(cmds === 'member'){

            //Membros mencionado
            let mention = msg.author; 
            if(msg.mentions.users.first())
                mention = msg.mentions.users.first();
            
            //Informações
            var _mymember_avatar = mention.avatarURL;
            var _mymember_name = mention.username+'#'+mention.discriminator;
            var _mymember_id = mention.id;
            var _mymember_status = mention.presence.status;
            var _mymember_game = mention.presence.game;
            var _mymember_creation = mention.createdTimestamp;
            var _mymember_since = msg.guild.member(mention.id).joinedTimestamp;
            var _mymember_lastmsg = msg.guild.member(mention.id).lastMessage.toString();
            var _mymember_lastmsgstamp = msg.guild.member(mention.id).lastMessage.createdTimestamp;

            //Embed
            let _myembed = new Discord.RichEmbed()
            .setColor('#7300FE')
            .setAuthor('Member Information','https://i.imgur.com/V55YFln.png')
            .setThumbnail(_mymember_avatar)
            .addField('👤 Name',"``"+_mymember_name+"``",true)
            .addField('🏷 ID',"``"+_mymember_id+"``",true)
            .addField('🔔 Status',_mymember_status,true)
            .addField('🎮 Playing',_mymember_game,true)
            .addField('📆 Creation',mytimestampdate(_mymember_creation),false)
            .addField('⌛ Joined at',mytimestampdate(_mymember_since),false)
            .addField('💬 Last Message ('+mytimestampdate(_mymember_lastmsgstamp)+')',"```"+_mymember_lastmsg+"```",false);
            msg_channel.send(_myembed);
        }
    }
    //💬 [TEXT]
    {
        if(cmds === 'ofensafoda')
            msg.reply("seu filho da puta arobado troxa vagabudo idiota babaca maluco doente mental poser fake corvade medorso mentalidade de 4 anos lixo humano vai ver que to na esquina FAMILIA E UM FILHO DE UMA PUTA VC E SUA FAMILIA E SEUS AMIGOS E AMIGAS SAO TUDO FILHO DE UM PUTA SEU COVARDE TA COM MEDO DE ME ENFRENTAR VAMOS VER SE VC E HOMEM SOFESIENTE ME ENFRETAR CARA A CARA SEU FILHHO DE UMA PUTA");  
        
        if(cmds === 'molek')
            msg.reply("Bro, this nin gamer is a molek who likes provoquing brigs \nThey already said much about him \nhe does stream on youtube, have 5k followers and he founds himself the such, that's why he keeps saying shit to all the side");
    }
    //📁 [FILES]
    {
        if(cmds === 'drake'){

            let _myfile = new Discord.Attachment('./cosmos_assets/files/drake.jpg');
            msg_channel.startTyping();
            msg_channel.send('',_myfile);
            msg_channel.stopTyping(true);
        }

        if(cmds === 'arrombados'){

            let _myfile = new Discord.Attachment('./cosmos_assets/files/fala_ae_arrombados.jpg');
            msg_channel.startTyping();
            msg_channel.send('AQUI É O METHEUS',_myfile);
            msg_channel.stopTyping(true);
        }

        if(cmds === 'fraga'){

            let _myfileA = new Discord.Attachment('./cosmos_assets/files/apple.gif');
            let _myfileB = new Discord.Attachment('./cosmos_assets/files/apple.ogg');
            msg_channel.startTyping();
            msg_channel.send('',_myfileB);
            msg_channel.startTyping();
            msg_channel.send('',_myfileA);
            msg_channel.stopTyping(true);
        }      

        if(cmds === 'fanfic'){

            let _myfile = new Discord.Attachment('./cosmos_assets/files/fanfic.webm');
            msg_channel.startTyping();
            msg_channel.send('',_myfile);
            msg_channel.stopTyping(true);
        }

        if(cmds === 'daniru'){

            //Randomizar escolha (1 a 95)
            let _mypick = Math.round(Math.random()*94)+1;
            let _myfile = new Discord.Attachment('./cosmos_assets/files/daniru/'+_mypick+'.png');
            msg_channel.startTyping();
            msg_channel.send('E o filósofo disse...',_myfile);
            msg_channel.stopTyping(true);
        }

        if(cmds === 'canela'){

            let _myfile = new Discord.Attachment('./cosmos_assets/files/canela.gif');
            msg_channel.startTyping();
            msg_channel.send('',_myfile);
            msg_channel.stopTyping(true);
        }

        if(cmds === 'sources'){

            //Randomizar escolha (1 a 16)
            let _mypick = Math.round(Math.random()*15)+1;
            let _myfile = new Discord.Attachment('./cosmos_assets/files/sources/'+_mypick+'.png');
            msg_channel.startTyping();
            msg_channel.send('Informação exclusiva!',_myfile);
            msg_channel.stopTyping(true);
        }

        if(cmds === 'mansplaining'){

            //Escolher entre .PNG e .MP4
            let _myextension = ".png";
            let _myextension_pick =  Math.round(Math.random());
            if(_myextension_pick === 0)
                _myextension = ".mp4";

            //Randomizar escolha (0 a 1)
            let _mypick = Math.round(Math.random()*1);
            let _myfile = new Discord.Attachment('./cosmos_assets/files/mansplaining/machisto_'+_mypick+_myextension);
            msg_channel.startTyping();
            msg_channel.send('👀💦',_myfile);
            msg_channel.stopTyping(true);
            //Reagir
            //msg.reac(msg.guild.emojis.get('emn_anim_canela'))
        }

        if(cmds === 'elvingado'){

            //Randomizar escolha (1 a 10)
            let _mypick = Math.round(Math.random()*9)+1;
            let _myfile = new Discord.Attachment('./cosmos_assets/files/egado/'+_mypick+'.png');
            msg_channel.startTyping();
            msg_channel.send('',_myfile);
            msg_channel.stopTyping(true);
        }

        if(cmds === 'massas'){

            let _myfile = new Discord.Attachment('./cosmos_assets/files/massas.gif');
            msg_channel.startTyping();
            msg_channel.send('Preparando massa de manobra...',_myfile);
            msg_channel.stopTyping(true);
        }

        if(cmds === 'fresh'){

            let _myfile = new Discord.Attachment('./cosmos_assets/files/fresh.png');
            msg_channel.startTyping();
            msg_channel.send('BLRBLRBLRBLR',_myfile);
            msg_channel.stopTyping(true);
        }

        if(cmds === 'bitsvoadores'){

            let _myfile = new Discord.Attachment('./cosmos_assets/files/bits_voadores.ogg');
            msg_channel.startTyping();
            msg_channel.send('Que isso Noronha',_myfile);
            msg_channel.stopTyping(true);
        }

        if(cmds === 'mariostar'){

            //Randomizar escolha (1 a 20)
            let _mypick = Math.round(Math.random()*19)+1;
            let _myfile = new Discord.Attachment('./cosmos_assets/files/mariostar/'+_mypick+'.png');
            msg_channel.startTyping();
            msg_channel.send('Pronunciamento oficial do presidente:',_myfile);
            msg_channel.stopTyping(true);
        }

        if(cmds === 'himarck'){

            //Randomizar escolha (0 a 10)
            let _mypick = Math.round(Math.random()*10);
            let _myfile = new Discord.Attachment('./cosmos_assets/files/himarck/'+_mypick+'.ogg');
            msg_channel.startTyping();
            msg_channel.send('⚠️**ATENÇÃO:** ``Possível ruído na comunicação.``',_myfile);
            msg_channel.stopTyping(true);
        }    
    }
    //✏️ [CUSTOM]
    {
        if(cmds === 'mirror'){

            msg_channel.startTyping();

            //Buscar anexo
            let _myattach = myattach_get(0);

            //Carregar imagens
            let msk = await jimp.read('./cosmos_assets/custom/mirror_msk.png'); //Mascara
            let img = await jimp.read('./cosmos_assets/custom/mirror.png'); //molde
            jimp.read(_myattach).then(src => {

                //Redimensionar anexo
                src.resize(175,313);

                //Colocar anexo em cima da mascara
                msk.composite(src,255,107);

                //Colocar molde em cima do anexo+mascara
                msk.composite(img,0,0).write('./cosmos_assets/_temp/mirror.png');

                msg.reply('',{files:["./cosmos_assets/_temp/mirror.png"]});
                msg_channel.stopTyping(true);
            })
            .catch(err => {
                msg_channel.stopTyping(true);
                console.log(`Error: C.MIRROR`);
            })
        }

        if(cmds === 'parental'){
            
            msg_channel.startTyping();

            //Buscar anexo
            let _myattach = myattach_get(0);

            //Carregar imagens
            let msk = await jimp.read('./cosmos_assets/custom/parentalcontrol_msk.png'); //Mascara
            let img = await jimp.read('./cosmos_assets/custom/parentalcontrol.png'); //molde
            jimp.read(_myattach).then(src => {

                //Redimensionar anexo
                src.resize(626,355);

                //Colocar anexo em cima da mascara
                msk.composite(src,27,26);

                //Colocar molde em cima do anexo+mascara
                msk.composite(img,0,0).write('./cosmos_assets/_temp/notmyson.png');

                msg.reply('',{files:["./cosmos_assets/_temp/notmyson.png"]});
                msg_channel.stopTyping();
            })
            .catch(err => {
                msg_channel.stopTyping(true);
                console.log(`Error: C.PARENTAL`);
            })
        }
        if(cmds === 'level'){
    
            msg_channel.startTyping();

            //Buscar anexo
            let _myattach = myattach_get(0);
    
            //Carregar imagens
            let msk = await jimp.read('./cosmos_assets/custom/level_msk.png'); //Mascara
            let img = await jimp.read('./cosmos_assets/custom/level.png'); //molde
            jimp.read(_myattach).then(src => {
    
                //Redimensionar anexo
                src.resize(640,360);
    
                //Colocar anexo em cima da mascara
                msk.composite(src,0,0);
    
                //Colocar molde em cima do anexo+mascara
                msk.composite(img,0,0).write('./cosmos_assets/_temp/world1.png');
    
                msg.reply('',{files:["./cosmos_assets/_temp/world1.png"]});
                msg_channel.stopTyping(true);
            })
            .catch(err => {
                msg_channel.stopTyping(true);
                console.log(`Error: C.LEVEL`);
            })    
        }
        if(cmds === 'computer'){
        
            msg_channel.startTyping();

            //Buscar anexo
            let _myattach = myattach_get(0);
        
            //Carregar imagens
            let img = await jimp.read('./cosmos_assets/custom/computer.png'); //molde
            jimp.read(_myattach).then(src => {
    
                //Redimensionar anexo
                src.resize(223,167);
        
                //Colocar anexo em cima do molde
                img.composite(src,0,122).write('./cosmos_assets/_temp/pc.png');
        
                msg.reply('',{files:["./cosmos_assets/_temp/pc.png"]});
                msg_channel.stopTyping(true);
            })
            .catch(err => {
                msg_channel.stopTyping(true);
                console.log(`Error: C.COMPUTER`);
            })    
        }
        if(cmds === 'gun'){

            msg_channel.startTyping();

            //Buscar anexo
            let _myattach = myattach_get(0);
    
            //Carregar imagens
            let msk = await jimp.read('./cosmos_assets/custom/gun_msk.png'); //Mascara
            let img = await jimp.read('./cosmos_assets/custom/gun.png'); //molde
            let upload = '';
            jimp.read(_myattach).then(src => {
    
                //Redimensionar anexo
                src.resize(310,414);
    
                //Colocar anexo em cima da mascara
                msk.composite(src,0,0);
    
                //Colocar molde em cima do anexo+mascara
                msk.composite(img,0,0).write('./cosmos_assets/_temp/ohno.png');
    
                msg.reply('',{files:["./cosmos_assets/_temp/ohno.png"]});
            })
            .catch(err => {
                msg_channel.stopTyping(true);
                console.log(`Error: C.GUN`);
            })
        }    
    }

    //🕹 [BOX ARTS]
    if(cmds === 'boxart'){

        //Checar parametros
        if(args.length === 0) msg.reply("❓ | **Missing Parameter:** ``Console``");
        else{

            let _skip = 0;

            switch(args[0].toLowerCase()){

                case 'switch':
                var _myboxart_cover = 'switch';
                var _myboxart_x = 0;
                var _myboxart_y = 13;
                var _myboxart_w = 293;
                var _myboxart_h = 411;
                break;

                case 'wiiudark':
                var _myboxart_cover = 'wiiudark';
                var _myboxart_x = 0;
                var _myboxart_y = 13;
                var _myboxart_w = 293;
                var _myboxart_h = 411;
                break;

                case 'wiiu':
                var _myboxart_cover = 'wiiu';
                var _myboxart_x = 0;
                var _myboxart_y = 13;
                var _myboxart_w = 293;
                var _myboxart_h = 411;
                break;

                case 'wiired':
                var _myboxart_cover = 'wiired';
                var _myboxart_x = 0;
                var _myboxart_y = 13;
                var _myboxart_w = 293;
                var _myboxart_h = 411;
                break;

                case 'wii':
                var _myboxart_cover = 'wii';
                var _myboxart_x = 0;
                var _myboxart_y = 13;
                var _myboxart_w = 293;
                var _myboxart_h = 411;
                break;

                case 'gamecube':
                var _myboxart_cover = 'gamecube';
                var _myboxart_x = 0;
                var _myboxart_y = 13;
                var _myboxart_w = 293;
                var _myboxart_h = 411;
                break;

                case 'n64eu':
                var _myboxart_cover = 'n64eu';
                var _myboxart_x = 58;
                var _myboxart_y = 46;
                var _myboxart_w = 312;
                var _myboxart_h = 223;
                break;

                case 'n64':
                var _myboxart_cover = 'n64';
                var _myboxart_x = 0;
                var _myboxart_y = 0;
                var _myboxart_w = 436;
                var _myboxart_h = 304;
                break;

                case 'superfamicom':
                var _myboxart_cover = 'superfamicom';
                var _myboxart_x = 0;
                var _myboxart_y = 60;
                var _myboxart_w = 212;
                var _myboxart_h = 284;
                break;

                case 'snes':
                var _myboxart_cover = 'snes';
                var _myboxart_x = 0;
                var _myboxart_y = 13;
                var _myboxart_w = 402;
                var _myboxart_h = 243;
                break;

                case '3ds':
                var _myboxart_cover = '3ds';
                var _myboxart_x = 0;
                var _myboxart_y = 7;
                var _myboxart_w = 292;
                var _myboxart_h = 289;
                break;

                case '3dsdark':
                var _myboxart_cover = '3dsdark';
                var _myboxart_x = 0;
                var _myboxart_y = 7;
                var _myboxart_w = 292;
                var _myboxart_h = 289;
                break;

                case 'ds':
                var _myboxart_cover = 'ds';
                var _myboxart_x = 45;
                var _myboxart_y = 7;
                var _myboxart_w = 280;
                var _myboxart_h = 289;
                break;

                case 'gbaeu':
                var _myboxart_cover = 'gbaeu';
                var _myboxart_x = 56;
                var _myboxart_y = 0;
                var _myboxart_w = 277;
                var _myboxart_h = 304;
                break;
            
                case 'gba':
                var _myboxart_cover = 'gba';
                var _myboxart_x = 69;
                var _myboxart_y = 0;
                var _myboxart_w = 265;
                var _myboxart_h = 304;
                break;
            
                case 'gbc':
                var _myboxart_cover = 'gbc';
                var _myboxart_x = 62;
                var _myboxart_y = 0;
                var _myboxart_w = 271;
                var _myboxart_h = 304;
                break;

                case 'virtualboy':
                var _myboxart_cover = 'virtualboy';
                var _myboxart_x = 0;
                var _myboxart_y = 19;
                var _myboxart_w = 333;
                var _myboxart_h = 231;
                break;

                case 'gameboy':
                var _myboxart_cover = 'gameboy';
                var _myboxart_x = 57;
                var _myboxart_y = 0;
                var _myboxart_w = 276;
                var _myboxart_h = 304;
                break;

                default:
                    msg.reply("❌ | **Invalid Parameter:** ``Console``");
                    _skip = 1;
            }

            if(_skip === 0){

                msg_channel.startTyping();

                //Buscar anexo
                let _myattach = myattach_get(1);
                
                //Carregar imagens
                let msk = await jimp.read('./cosmos_assets/boxart/mask/'+_myboxart_cover+'.png');
                let img = await jimp.read('./cosmos_assets/boxart/'+_myboxart_cover+'.png');

                jimp.read(_myattach).then(src => {

                    //Redimensionar anexo
                    src.resize(_myboxart_w,_myboxart_h);
                    msk.composite(src,_myboxart_x,_myboxart_y);
                    
                    msk.composite(img,0,0).write('./cosmos_assets/_temp/boxart.png');

                    msg.reply('',{files:["./cosmos_assets/_temp/boxart.png"]});
                    msg_channel.stopTyping(true);
                })
                .catch(err => {
                    msg_channel.stopTyping(true);
                    console.log(`Error: C.BOXART ${args[0]} `);
                })
            }
        }
    }
    //⭐ [QUOTE]
    if(cmds === 'quote'){

        //Checar parametros
        if(args.length === 0) msg.reply("❓ | **Missing Parameter:** ``Character`` ``Text``");
        else if(args.length === 1) msg.reply("❓ | **Missing Parameter:** ``Text``");
        else{

            let _skip = 0;

            //Antes, checar se foto de perfil do personagem existe na pasta
            if(!FS.existsSync('./cosmos_assets/quotes/'+args[0].toLowerCase()+'.jpg')) {

                msg.reply("❌ | **Invalid Parameter:** ``Character``");
                _skip = 1;
            }

            if(_skip === 0){

                //Remover mensagem do autor
                msg.delete();

                //Criar client
                var hook = new Discord.WebhookClient('620800081049813013','ZsQ3PjLzmGRuRjA5G-lzj_HBn1UD1_QEDT9v57B6WNu_ELmdImsgAFNejrSyD_Ptc5Mr')
                    
                //Nome: Transformar primeira letra em maiuscula e resto minusculo
                let _mychar_firstletter = args[0].charAt(0).toUpperCase();
                let _mychar_others = args[0].slice(1,args[0].length).toLowerCase();
                let _mychar = _mychar_firstletter+_mychar_others;

                //Modificar nome e avatar (Sync)
                await hook.edit(_mychar,'./cosmos_assets/quotes/'+_mychar.toLowerCase()+'.jpg');

                //Mesclar array de argumentos e remover o primeiro
                let _mymsg_merge = args.join(" ");
                let _mymsg_noargument = _mymsg_merge.replace(args[0]," ");

                //Remover menções
                let _mymsg_noping = _mymsg_noargument.replace('@'," ");
                for(var _mymsg_ping = 0; _mymsg_ping < 2; _mymsg_ping++){

                    _mymsg_noping = _mymsg_noping.replace('@'," ");
                    if(_mymsg_noping.startsWith('@') === true)
                        _mymsg_ping = 0;
                }

                //Enviar mensagem
                hook.send(_mymsg_noping);
            }
        }
    }
    //📥 [DOWNLAODS]
    if(cmds === 'download'){

        //Checar parametros
        if(args.length === 0) msg.reply("❓ | **Missing Parameter:** ``Title``");
        else{

            let _skip = 0;

            switch(args[0].toLowerCase()){

                case '2duniverse':
                var _mydownload_title = 'Super Mario 2D Universe';
                var _mydownload_description = 'This demo features 10 courses.';
                var _mydownload_link = 'https://mfgg.net/index.php?act=resdb&param=03&c=2&id=31592';
                var _mydownload_version = '1.2.0';
                var _mydownload_size = '44';
                var _mydownload_preview = 'https://i.imgur.com/0mP2fm1.png';
                var _mydownload_author = '@Nin★Gamer#8700';
                var _mydownload_moreinfo_title = '';
                var _mydownload_moreinfo_text = '';
                break;

                case 'unimaker':
                var _mydownload_title = 'Super Mario UniMaker';
                var _mydownload_description = 'Maker your own 2D Universe! further informations in<#539302506178543616>';
                var _mydownload_link = 'https://gamejolt.com/games/unimaker/413202';
                var _mydownload_version = '1.S (Update 2)';
                var _mydownload_size = '281';
                var _mydownload_preview = 'https://i.gjcdn.net/data/games/6/202/413202/screenshots/screenshot_1-v9impwqs.png';
                var _mydownload_author = '@Nin★Gamer#8700';
                var _mydownload_moreinfo_title = '.ZIP Password';
                var _mydownload_moreinfo_text = '``GAUcs0VrAyVKweFGH89sgzBfHnq0aY9i``';
                break;

                case 'unimaker':
                var _mydownload_title = 'Ninty Launcher';
                var _mydownload_description = 'Written in GML, Ninty is a launcher based on the Nintendo Switch interface to run the main Fan Games (and several other softwares) out there. \n **Discord Server:** https://discord.gg/hPzDxgD \n **GitHub:** https://github.com/MarioSilvaGH/Ninty-Launcher';
                var _mydownload_link = 'https://github.com/MarioSilvaGH/Ninty-Launcher/releases/download/v1.9.0/NintyLauncher_190.zip';
                var _mydownload_version = '1.9.0';
                var _mydownload_size = '8.35';
                var _mydownload_preview = 'https://github.com/MarioSilvaGH/Ninty-Launcher/raw/master/assets/demo_themes.gif';
                var _mydownload_author = '@Nin★Gamer#8700';
                var _mydownload_moreinfo_title = '';
                var _mydownload_moreinfo_text = '';
                break;

                default:
                    msg.reply("❌ | **Invalid Parameter:** ``Title``");
                    _skip = 1;
            }

            if(_skip === 0){

                //Criar embed
                let _myembed = new Discord.RichEmbed()
                .setColor('#7300FE')
                .setTitle(_mydownload_title) //Title
                .setURL(_mydownload_link) //Download
                .setDescription(_mydownload_description)
                .setThumbnail('https://i.imgur.com/XcQnYDD.png')
                .addField('Version', '**'+_mydownload_version+'**', true)
                .addField('Size', '**'+_mydownload_size+'** MB', true)
                .setImage(_mydownload_preview) //Preview
                .setFooter('Creator: '+_mydownload_author, 'https://i.imgur.com/V55YFln.png');
        
                //Informações adicionais (Se existirem)
                if(_mydownload_moreinfo_title !== '' && _mydownload_moreinfo_text !== '')
                    _myembed.addField(_mydownload_moreinfo_title,_mydownload_moreinfo_text,false)

                //Enviar mensagem no canal
                msg.reply(`Here is your download:`,_myembed);
            }
        }
    }
});
//---------------------------------------------------------------------------

//Fazer login do client
cosmos_client.login(cosmos_cfg.token);