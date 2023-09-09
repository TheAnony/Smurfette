const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, ButtonStyle } = require("discord.js")
const { QuickDB } = require('quick.db')
const db = new QuickDB();
const { PaginationWrapper } = require('djs-button-pages');
const { NextPageButton, PreviousPageButton } = require('@djs-button-pages/presets');

module.exports = {
    name: "banimento", // Coloque o nome do comando
    description: "『 MOREDAÇÃO 』", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'moderation',
            description: `Acessa o painel de moderação.`,
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'ban-temporario',
                    description: `Aplica um banimento temporário a um membro.`,
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'member',
                            description: `Informe qual cargo deseja adicionar/remover.`,
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        }
                    ]
                },
                {
                    name: 'ban-permanente',
                    description: `Aplica um banimento parmenente a um membro.`,
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'unban',
                    description: `Desbane um membro.`,
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'ban-list',
                    description: `Mostra todos os banimentos e seus respectivos punidores.`,
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'config-ban-message',
                    description: `Mostra todos os banimentos e seus respectivos punidores.`,
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ]
        },
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ content: `**Você não tem permissão de utilizar esse comando!**`, ephemeral: true })

        const subcommand = interaction.options.getSubcommand();
        const User = interaction.options.getUser('member') || interaction.user.id
        const Member = interaction.guild.members.cache.get(User.id)
        const AuthorUser = interaction.user;
        const AuthorMember = interaction.member;
        const Guild = interaction.guild.id;

        let bansGlobal = await db.get(`bansGlobal_${Guild}.bans`)
        if (!bansGlobal) bansGlobal = await db.set(`bansGlobal_${Guild}`, {
            bans: {}
        })

        let banCountMod = await db.get(`banCountMod_${AuthorUser.id}`);
        if (!banCountMod) banCountMod = await db.set(`banCountMod_${AuthorUser.id}`, 0);

        switch (subcommand) {
            case 'ban-temporario':
                banTemp();
                break;

            case 'ban-permanente':
                banPerm();
                break;

            case 'unban':
                unBan();
                break;

            case 'ban-list':
                banList();
                break;

            case 'config-ban-message':
                banMessage();
                break;
                
            default:
                break;
        };

        async function banTemp() {
            return interaction.reply(`Nada ainda!`)
        };

        async function banPerm() {
            return interaction.reply(`Nada ainda!`)
        };

        async function unBan() {
            return interaction.reply(`Nada ainda!`)
        };

        async function banList() {
            /* let bansGlobalArray = Object.keys(bansGlobal);
            let embeds = pagesCreate(bansGlobalArray); */

            let bansGlobalArray = ['GUIW', 'B4LACO', 'SIMONY', 'ANONY', 'LOTADO', 'MELEUS'];

            const embeds = embedsCreate(bansGlobalArray)
            console.log(embedsCreate(bansGlobalArray));
            const buttons = [
                new PreviousPageButton({ custom_id: "prev_page", emoji: "↩️", style: ButtonStyle.Primary }),
                new NextPageButton({ custom_id: "next_page", emoji: "▶️", style: ButtonStyle.Primary }),
            ]

            const paginacao = new PaginationWrapper()
                .setButtons(buttons)
                .setEmbeds(embeds)
                .setFilterOptions({
                    allowedUsers: [interaction.user.id],
                    filterUsers: true
                })

            console.log(paginacao);

            await paginacao.interactionReply(interaction)

            function embedsCreate(bansArray) {
                let pages = [];
                let currentPage = [];
                let totaldepaginas = 1;
                if (typeof bansArray !== 'object') return;

                for (let i = 0; i < bansArray.length; i++) {
                    currentPage.push(bansArray[i]);

                    if (currentPage.length === 7 || i === bansArray.length - 1) {
                        totaldepaginas++;
                        currentPage = [];
                    };
                };

                for (let i = 0; i < bansArray.length; i++) {
                    currentPage.push(bansArray[i]);

                    if (currentPage.length === 7 || i === bansArray.length - 1) {
                        const embed = new EmbedBuilder()
                            .setTitle(`Lista de usuários banidos:`)
                            .setDescription(currentPage.join(`\n`))
                            .setColor('DarkButNotBlack')
                            .setFooter({ text: `Página ${pages.length + 1}/${totaldepaginas-1}` })

                        pages.push(embed);
                        currentPage = [];
                    };
                };
                return pages;
            };
        }
    }
}