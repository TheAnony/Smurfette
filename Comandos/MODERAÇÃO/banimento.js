const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits, ButtonStyle } = require("discord.js")
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
                            name: 'member-temp',
                            description: `Mencione o membro.`,
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: 'tempo',
                            description: 'Informe o período do banimento temporário. (s/m/h/d)',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        },
                        {
                            name: 'motivo-temp',
                            description: 'Informe o motivo.',
                            type: ApplicationCommandOptionType.String,
                            required: false
                        },
                    ]
                },
                {
                    name: 'ban-permanente',
                    description: `Aplica um banimento parmenente a um membro.`,
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'member-perm',
                            description: `Mencione o membro.`,
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: 'motivo-perm',
                            description: 'Informe o motivo.',
                            type: ApplicationCommandOptionType.String,
                            required: false
                        },
                    ]
                },
                {
                    name: 'unban',
                    description: `Desbane um membro.`,
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'member-unban',
                            description: `Informe o id do membro.`,
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: 'motivo-unban',
                            description: 'Informe o motivo.',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        },
                    ]
                },
                {
                    name: 'ban-list',
                    description: `Mostra todos os banimentos e seus respectivos punidores.`,
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'config-ban-message',
                    description: `Mostra e configura a mensagem de banimento do moderador.`,
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
        const Channel = client.channels.cache.get('1150047974970380358')

        let bans = await interaction.guild.bans.fetch()
        let bansGlobal = bans.map(map => {
            return `**Usuário:** ${map.user.username} (${map.user.id})
        **Motivo de banimento:** ${map.reason}`
        })
        let bansForId = bans.map(map => {
            return `${map.user.id}`
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
            const user = interaction.options.getUser('member-temp');
            const member = interaction.guild.members.cache.get(user.id);
            const motivo = interaction.options.getString('motivo-temp') || 'Indefinido'
            const time = interaction.options.getString('tempo');
            let tempo = pegarTempoEmMs(time)
            if(tempo === 'err') return interaction.reply({ephemeral: true, content: `**:x: | Tempo inválido!**`})

            if (member.id === interaction.user.id) return interaction.reply({ ephemeral: true, content: '**:x: | Você não pode banir a si mesmo!**' });

            member.ban({ reason: [motivo] }).then(() => {
                interaction.reply(`✅ | O membro ${user.username} foi banido com sucesso durante`)
            })

        };

        async function banPerm() {
            return interaction.reply(`Nada ainda!`)
        };

        async function unBan() {
            return interaction.reply(`Nada ainda!`)
        };

        async function banList() {
            const embeds = embedsCreate(bansGlobal)
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
                            .setDescription(`${currentPage.join(`\n\n`)}`)
                            .setColor('DarkButNotBlack')
                            .setFooter({ text: `Página ${pages.length + 1}/${totaldepaginas - 1}` })

                        pages.push(embed);
                        currentPage = [];
                    };
                };
                return pages;
            };
        }

        async function banMessage() {

        }

        async function banMessage() {

        }
    }
}