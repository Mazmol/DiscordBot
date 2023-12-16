// Load required resources =================================================================================================
const { SlashCommandBuilder } = require('discord.js');
// const axios = require('axios');
const rp = require('request-promise');
const cheerio = require('cheerio');

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('cfx')
        .setDescription('Status of cfx.re services')
        .setDMPermission(false),
    async execute(interaction) {
        try {
            // axios.get('https://status.cfx.re/api/v2/status.json').then((response) => {
            //     const cfx_status = response.data.status.indicator;
            // }).catch((error) => {
            //     console.error(`[cmd:slash:cfx:axios] ${error.message}`);
            //     return interaction.reply({
            //         content: 'Hubo un inconveniente al recuperar la información de los servicios de **cfx.re**, por favor intenta nuevamente en unos instantes',
            //         ephemeral: true
            //     });
            // });
            rp('https://status.cfx.re/').then((html) => {
                const $ = cheerio.load(html)
                const urlElems = $('div.child-components-container > div.component-inner-container')
        
                var fivemStatus = '';
                var totalServices = 0;
                var totalUp = 0;
                var embed_services_list = '';
                for(let i = 0; i < urlElems.length; i++) {
                    const title = $($(urlElems[i]).find('span.name')[0]).text().trim().replaceAll('"', "");
                    const desc  = $($(urlElems[i]).find('span.component-status')[0]).text().trim();

                    if(title == 'FiveM') { fivemStatus = desc; }

                    if([ 'Cfx.re Platform Server (FXServer)', 'CnL', 'Policy', 'Keymaster' ].includes(title)) {
                        totalServices = (totalServices + 1);
                        if(desc == 'Operational') {
                            totalUp = (totalUp + 1);
                            emoji_status = '🟢';
                        } else {
                            emoji_status = '🔴';
                        }

                        embed_services_list += `${emoji_status} ${title}\n`;
                    }
                }

                switch(fivemStatus) {
                    // 🔴 Fallos graves
                    case 'Major Outage':
                        var embed_description = `There may be problems accessing FiveM servers..\n**${totalUp}/${totalServices} servicios activos**`;
                        var embed_color       = 0x991a31;
                    break;
                    // 🟡 Fallos leves y Mantenimiento Programado
                    case 'Degraded Performance':
                    case 'Under Maintenance':
                    case 'Partial Outage':
                        var embed_description = `There may be problems accessing FiveM servers..\n**${totalUp}/${totalServices} servicios activos**`;
                        var embed_color       = 0xe8a74d;
                    break;
                    // 🟢 Servicios operativos
                    default:
                    case 'Operational':
                        var embed_description = `All cfx.re services are active..`;
                        var embed_color       = 0x2f964a;
                    break;
                }

                return interaction.reply({ embeds: [{
                    color: embed_color,
                    title: '🐌 Monitor cfx.re',
                    description: embed_description+"\n"+"```"+embed_services_list+"```"
                }] });
            }).catch((error) => {
                console.error(`[cmd:slash:cfx:rp] ${error.message}`);
                return interaction.reply({
                    content: 'There was a problem retrieving information from **cfx.re** services, please try again in a few moments.',
                    ephemeral: true
                });
            });
        } catch(error) {
            console.error(`[cmd:slash:cfx] ${error.message}`);
            return interaction.reply({
                content: 'There was a problem retrieving information from **cfx.re** services, please try again in a few moments.',
                ephemeral: true
            });
        }
    }
};