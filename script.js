const SUPABASE_URL = "https://uoqvnwkcvctbaujalprc.supabase.co";

const SUPABASE_KEY = "sb_publishable_x7mGxz7QtNNB1JAAZIpPew_UsJ1RDb2";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================================
   QUANDO A PÁGINA CARREGAR
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    /* -----------------------------------------------------
       ANO AUTOMÁTICO DO RODAPÉ
       ----------------------------------------------------- */

    const anoAtual = new Date().getFullYear();

    const year = document.getElementById("year");
    const yearFooter = document.getElementById("year-footer");

    if (year) {
        year.textContent = anoAtual;
    }

    if (yearFooter) {
        yearFooter.textContent = anoAtual;
    }


    /* -----------------------------------------------------
       CARREGAR PROJETOS
       ----------------------------------------------------- */

    const projectsGrid = document.getElementById("projects-grid");

    if (projectsGrid) {
        await loadProjects();
    }


    /* -----------------------------------------------------
       VERIFICAR USUÁRIO LOGADO
       ----------------------------------------------------- */

    const {
        data: {
            session
        }
    } = await supabaseClient.auth.getSession();

    atualizarInterfaceConta(session);


    /* -----------------------------------------------------
       OBSERVAR LOGIN / LOGOUT
       ----------------------------------------------------- */

    supabaseClient.auth.onAuthStateChange(
        async (event, session) => {

            atualizarInterfaceConta(session);

        }
    );


    /* -----------------------------------------------------
       FORMULÁRIO DE CADASTRO
       ----------------------------------------------------- */

    const userForm = document.getElementById("user-form");

    if (userForm) {

        userForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            await cadastrarUsuario();

        });

    }


    /* -----------------------------------------------------
       FORMULÁRIO DE LOGIN
       ----------------------------------------------------- */

    const loginForm = document.getElementById("login-form");

    if (loginForm) {

        loginForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            await fazerLogin();

        });

    }


    /* -----------------------------------------------------
       BOTÃO DE SAIR
       ----------------------------------------------------- */

    const logoutButton = document.getElementById("logout-button");

    if (logoutButton) {

        logoutButton.addEventListener("click", async () => {

            await sairDaConta();

        });

    }


    /* -----------------------------------------------------
       FORMULÁRIO DE CONTATO / LEAD
       ----------------------------------------------------- */

    const leadForm = document.getElementById("lead-form");

    if (leadForm) {

        leadForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            await enviarLead();

        });

    }

});


/* =========================================================
   CADASTRAR USUÁRIO
   ========================================================= */

async function cadastrarUsuario() {

    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const tipoInput = document.getElementById("tipo_usuario");

    if (!nomeInput || !emailInput || !senhaInput || !tipoInput) {

        console.error(
            "Os campos do formulário de cadastro não foram encontrados."
        );

        return;

    }


    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value;
    const tipoUsuario = tipoInput.value;


    /* -----------------------------------------------------
       VALIDAÇÕES
       ----------------------------------------------------- */

    if (!nome || !email || !senha || !tipoUsuario) {

        alert("Preencha todos os campos.");

        return;

    }


    if (senha.length < 6) {

        alert(
            "A senha precisa ter pelo menos 6 caracteres."
        );

        return;

    }


    try {

        const {
            data,
            error
        } = await supabaseClient.auth.signUp({

            email: email,

            password: senha,

            options: {

                data: {

                    nome: nome,

                    tipo_usuario: tipoUsuario

                }

            }

        });


        if (error) {

            console.error(
                "Erro no cadastro:",
                error
            );

            alert(
                "Não foi possível criar a conta:\n" +
                error.message
            );

            return;

        }


        /* -------------------------------------------------
           CASO O USUÁRIO JÁ ENTRE AUTOMATICAMENTE
           ------------------------------------------------- */

        if (data.session) {

            alert(
                "Conta criada com sucesso! 🔓"
            );

            atualizarInterfaceConta(data.session);


            /* ---------------------------------------------
               IR PARA O PORTFÓLIO
               --------------------------------------------- */

            window.location.href = "portfolio.html";

        }

        /* -------------------------------------------------
           CASO PRECISE CONFIRMAR O E-MAIL
           ------------------------------------------------- */

        else {

            alert(
                "Conta criada com sucesso! 📧\n\n" +
                "Verifique seu e-mail para confirmar a conta."
            );

        }


        /* Limpar formulário */

        const form = document.getElementById("user-form");

        if (form) {
            form.reset();
        }


    } catch (error) {

        console.error(
            "Erro inesperado:",
            error
        );

        alert(
            "Ocorreu um erro ao criar sua conta."
        );

    }

}


/* =========================================================
   LOGIN
   ========================================================= */

async function fazerLogin() {

    const emailInput =
        document.getElementById("login-email");

    const senhaInput =
        document.getElementById("login-senha");


    if (!emailInput || !senhaInput) {

        console.error(
            "Campos de login não encontrados."
        );

        return;

    }


    const email = emailInput.value.trim();

    const senha = senhaInput.value;


    /* -----------------------------------------------------
       VALIDAÇÕES
       ----------------------------------------------------- */

    if (!email || !senha) {

        alert(
            "Digite seu e-mail e sua senha."
        );

        return;

    }


    try {

        const {
            data,
            error
        } = await supabaseClient.auth.signInWithPassword({

            email: email,

            password: senha

        });


        if (error) {

            console.error(
                "Erro no login:",
                error
            );

            alert(
                "Não foi possível entrar:\n" +
                error.message
            );

            return;

        }


        alert(
            "Login realizado com sucesso! 🔓"
        );


        atualizarInterfaceConta(data.session);


        /* -------------------------------------------------
           IR PARA O PORTFÓLIO
           ------------------------------------------------- */

        window.location.href = "portfolio.html";


    } catch (error) {

        console.error(
            "Erro inesperado:",
            error
        );

        alert(
            "Ocorreu um erro ao fazer login."
        );

    }

}


/* =========================================================
   ATUALIZAR INTERFACE DA CONTA
   ========================================================= */

function atualizarInterfaceConta(session) {

    const accountButton =
        document.getElementById("account-button");

    const accountIcon =
        document.getElementById("account-icon");

    const accountText =
        document.getElementById("account-text");


    const contaTitulo =
        document.getElementById("conta-titulo");

    const contaMensagem =
        document.getElementById("conta-mensagem");

    const contaDados =
        document.getElementById("conta-dados");

    const logoutButton =
        document.getElementById("logout-button");


    /* -----------------------------------------------------
       USUÁRIO NÃO ESTÁ LOGADO
       ----------------------------------------------------- */

    if (!session) {

        if (accountButton) {

            accountButton.href = "#conta";

        }

        if (accountIcon) {

            accountIcon.textContent = "🔒";

        }

        if (accountText) {

            accountText.textContent = "Entrar";

        }

        if (contaTitulo) {

            contaTitulo.textContent =
                "Sua conta";

        }

        if (contaMensagem) {

            contaMensagem.textContent =
                "Faça login ou crie sua conta para acessar sua área.";

        }

        if (contaDados) {

            contaDados.hidden = true;

        }

        if (logoutButton) {

            logoutButton.hidden = true;

        }

        return;

    }


    /* -----------------------------------------------------
       USUÁRIO ESTÁ LOGADO
       ----------------------------------------------------- */

    const user = session.user;

    const nome =
        user.user_metadata?.nome ||
        "Usuário";

    const tipoUsuario =
        user.user_metadata?.tipo_usuario ||
        "Visitante";

    const email =
        user.email ||
        "";


    /* -----------------------------------------------------
       BOTÃO DO CABEÇALHO
       ----------------------------------------------------- */

    if (accountButton) {

        accountButton.href = "#conta";

    }

    if (accountIcon) {

        accountIcon.textContent = "🔓";

    }

    if (accountText) {

        accountText.textContent = "Minha conta";

    }


    /* -----------------------------------------------------
       ÁREA DA CONTA
       ----------------------------------------------------- */

    if (contaTitulo) {

        contaTitulo.textContent =
            `Olá, ${nome}! 👋`;

    }

    if (contaMensagem) {

        contaMensagem.textContent =
            "Sua conta está conectada ao site.";

    }


    /* -----------------------------------------------------
       DADOS DO USUÁRIO
       ----------------------------------------------------- */

    if (contaDados) {

        contaDados.hidden = false;

        contaDados.innerHTML = `

            <div class="conta-item">

                <strong>👤 Nome</strong>

                <span>
                    ${escapeHtml(nome)}
                </span>

            </div>


            <div class="conta-item">

                <strong>📧 E-mail</strong>

                <span>
                    ${escapeHtml(email)}
                </span>

            </div>


            <div class="conta-item">

                <strong>🎓 Tipo de usuário</strong>

                <span>
                    ${escapeHtml(tipoUsuario)}
                </span>

            </div>

        `;

    }


    /* -----------------------------------------------------
       BOTÃO SAIR
       ----------------------------------------------------- */

    if (logoutButton) {

        logoutButton.hidden = false;

    }

}


/* =========================================================
   SAIR DA CONTA
   ========================================================= */

async function sairDaConta() {

    try {

        const {
            error
        } = await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Erro ao sair:",
                error
            );

            alert(
                "Não foi possível sair da conta."
            );

            return;

        }


        alert(
            "Você saiu da sua conta. 🔒"
        );


        atualizarInterfaceConta(null);


        /* -------------------------------------------------
           VOLTAR PARA A HOME
           ------------------------------------------------- */

        window.location.href = "index.html";


    } catch (error) {

        console.error(
            "Erro inesperado:",
            error
        );

        alert(
            "Ocorreu um erro ao sair da conta."
        );

    }

}


/* =========================================================
   CARREGAR PROJETOS DO SUPABASE
   ========================================================= */

async function loadProjects() {

    const projectsGrid =
        document.getElementById("projects-grid");


    if (!projectsGrid) {
        return;
    }


    /* Mensagem de carregamento */

    projectsGrid.innerHTML = `
        <div class="loading">
            Carregando projetos...
        </div>
    `;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("projetos")
            .select("*")
            .order("id", {
                ascending: false
            });


        if (error) {

            console.error(
                "Erro ao carregar projetos:",
                error
            );

            projectsGrid.innerHTML = `
                <div class="empty-state">
                    <h3>Não foi possível carregar os projetos.</h3>

                    <p>
                        Tente novamente mais tarde.
                    </p>
                </div>
            `;

            return;

        }


        /* -------------------------------------------------
           NENHUM PROJETO
           ------------------------------------------------- */

        if (!data || data.length === 0) {

            projectsGrid.innerHTML = `
                <div class="empty-state">

                    <h3>
                        Ainda não há projetos.
                    </h3>

                    <p>
                        Em breve novos projetos aparecerão aqui.
                    </p>

                </div>
            `;

            return;

        }


        /* -------------------------------------------------
           RENDERIZAR PROJETOS
           ------------------------------------------------- */

        projectsGrid.innerHTML = data
            .map((projeto) => {

                const foto =
                    projeto.foto ||
                    "https://placehold.co/600x400?text=Projeto";


                const nome =
                    projeto.nome ||
                    "Projeto sem nome";


                const descricao =
                    projeto.descricao ||
                    "Sem descrição disponível.";


                const categoria =
                    projeto.categoria ||
                    "Projeto";


                const link =
                    projeto.link ||
                    "#";


                return `

                    <article class="project-card">

                        <div class="project-image">

                            <img
                                src="${escapeHtml(foto)}"
                                alt="${escapeHtml(nome)}"
                                loading="lazy"
                                onerror="
                                    this.src='https://placehold.co/600x400?text=Projeto';
                                "
                            >

                        </div>


                        <div class="project-content">

                            <span class="project-category">
                                ${escapeHtml(categoria)}
                            </span>


                            <h3>
                                ${escapeHtml(nome)}
                            </h3>


                            <p>
                                ${escapeHtml(descricao)}
                            </p>


                            <a
                                href="${escapeHtml(link)}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="btn"
                            >
                                Ver projeto →
                            </a>

                        </div>

                    </article>

                `;

            })
            .join("");


    } catch (error) {

        console.error(
            "Erro inesperado:",
            error
        );

        projectsGrid.innerHTML = `
            <div class="empty-state">

                <h3>
                    Erro ao carregar os projetos.
                </h3>

                <p>
                    Tente novamente mais tarde.
                </p>

            </div>
        `;

    }

}


/* =========================================================
   FORMULÁRIO DE CONTATO
   ========================================================= */

async function enviarLead() {

    const form =
        document.getElementById("lead-form");


    if (!form) {
        return;
    }


    /* -----------------------------------------------------
       PEGAR VALORES
       ----------------------------------------------------- */

    const nome =
        document.getElementById("lead-nome")?.value.trim() || "";

    const email =
        document.getElementById("lead-email")?.value.trim() || "";

    const telefone =
        document.getElementById("lead-telefone")?.value.trim() || "";

    const servico =
        document.getElementById("servico_interesse")?.value || "";

    const orcamento =
        document.getElementById("orcamento_estimado")?.value || "";

    const assunto =
        document.getElementById("assunto")?.value.trim() || "";


    /* -----------------------------------------------------
       CAMPOS ALTERNATIVOS
       ----------------------------------------------------- */

    const nomeFinal =
        nome ||
        document.getElementById("nome")?.value.trim() ||
        "";

    const emailFinal =
        email ||
        document.getElementById("email")?.value.trim() ||
        "";


    if (!nomeFinal || !emailFinal) {

        alert(
            "Preencha seu nome e seu e-mail."
        );

        return;

    }


    try {

        const {
            error
        } = await supabaseClient
            .from("leads")
            .insert([

                {

                    nome: nomeFinal,

                    email: emailFinal,

                    telefone: telefone,

                    servico_interesse: servico,

                    orcamento_estimado: orcamento,

                    assunto: assunto

                }

            ]);


        if (error) {

            console.error(
                "Erro ao enviar formulário:",
                error
            );

            alert(
                "Não foi possível enviar sua mensagem:\n" +
                error.message
            );

            return;

        }


        alert(
            "Mensagem enviada com sucesso! 💜"
        );


        form.reset();


    } catch (error) {

        console.error(
            "Erro inesperado:",
            error
        );

        alert(
            "Ocorreu um erro ao enviar sua mensagem."
        );

    }

}


/* =========================================================
   PROTEÇÃO CONTRA HTML INJETADO
   ========================================================= */

function escapeHtml(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}