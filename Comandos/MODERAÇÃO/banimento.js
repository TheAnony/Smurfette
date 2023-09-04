const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")
const { QuickDB } = require('quick.db')
const db = new QuickDB();

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

            let bansGlobalArray = ['Guiw', 'Core', 'Anony', 'MrGuianas', 'Michael Jackson', 'Roberto Carlos', 'B4laco', 'Salame', 'Alvaro'];

            let embedsCreated = pagesCreate(bansGlobalArray)

            let painel = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId("banPages")
                  .setPlaceholder("Escolha a página!")
                  .addOptions(
                    
                    /* {
                      
                      label: "Página 1/8",
                      description: "PÁGINA SOBRE BOT [9]",
                      value: "pg1"
                    } */
                  )
              );

            function pagesCreate(bansArray) {
                let pages = [];
                let currentPage = [];

                for (let i = 0; i < bansArray.length; i++) {
                    currentPage.push(bansArray[i]);

                    if (currentPage.length === 7 || i === bansArray.length - 1) {
                        const embed = new EmbedBuilder()
                        .setTitle(`Lista de usuários banidos:`)
                        .setDescription(currentPage.join(`\n`));

                    pages.push(embed);
                    currentPage= [];
                    };
                }

                return pages;
            }
        }
    }
}