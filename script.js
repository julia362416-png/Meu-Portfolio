// ======================================================
// CONFIGURAÇÃO DO SUPABASE
// ======================================================

const SUPABASE_URL =
  'https://uoqvnwkcvctbaujalprc.supabase.co';

const SUPABASE_KEY =
  'sb_publishable_x7mGxz7QtNNB1JAAZIpPew_UsJ1RDbK2';


// ======================================================
// CONEXÃO
// ======================================================

let supabaseClient = null;

if (
  window.supabase &&
  SUPABASE_URL &&
  SUPABASE_KEY
) {

  supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

  console.log(
    '✅ Supabase conectado!'
  );

} else {

  console.error(
    '❌ Supabase não foi carregado.'
  );

}


// ======================================================
// QUANDO O SITE CARREGAR
// ======================================================

document.addEventListener(
  'DOMContentLoaded',
  async () => {

    // Ano
    const year =
      document.getElementById('year');

    if (year) {
      year.textContent =
        new Date().getFullYear();
    }


    // Projetos
    const projectsGrid =
      document.getElementById(
        'projects-grid'
      );

    if (projectsGrid) {
      loadProjects();
    }


    // Sistema de conta
    if (supabaseClient) {

      await verificarUsuario();

      configurarAutenticacao();

    }

  }
);


// ======================================================
// VERIFICAR USUÁRIO LOGADO
// ======================================================

async function verificarUsuario() {

  const {
    data,
    error
  } = await supabaseClient.auth.getSession();


  if (error) {

    console.error(
      'Erro ao verificar sessão:',
      error
    );

    return;

  }


  const session =
    data.session;


  if (session) {

    console.log(
      '🔒 Usuário conectado:',
      session.user.email
    );

    atualizarInterfaceUsuario(
      session.user
    );

  } else {

    console.log(
      '🔓 Nenhum usuário conectado.'
    );

    atualizarInterfaceUsuario(null);

  }


  // Fica observando login/logout
  supabaseClient.auth.onAuthStateChange(
    (_event, session) => {

      if (session) {

        atualizarInterfaceUsuario(
          session.user
        );

      } else {

        atualizarInterfaceUsuario(
          null
        );

      }

    }
  );

}


// ======================================================
// ATUALIZAR INTERFACE DO USUÁRIO
// ======================================================

function atualizarInterfaceUsuario(user) {

  const accountArea =
    document.getElementById(
      'account-area'
    );


  if (accountArea) {

    if (user) {

      const nome =
        user.user_metadata?.nome ||
        user.email?.split('@')[0] ||
        'Minha conta';


      accountArea.innerHTML = `

        <a
          href="portfolio.html"
          class="account-link logged"
        >
          🔒 ${nome}
        </a>

        <button
          type="button"
          id="logout-button"
          class="account-link"
          style="
            background: none;
            cursor: pointer;
            font-family: inherit;
          "
        >
          Sair
        </button>

      `;


      const logoutButton =
        document.getElementById(
          'logout-button'
        );


      if (logoutButton) {

        logoutButton.addEventListener(
          'click',
          fazerLogout
        );

      }

    } else {

      accountArea.innerHTML = `

        <a
          href="index.html#conta"
          class="account-link"
        >
          🔒 Entrar
        </a>

      `;

    }

  }


  // Dados dentro do formulário
  const loggedUser =
    document.getElementById(
      'logged-user'
    );


  if (!loggedUser) {
    return;
  }


  if (user) {

    loggedUser.style.display =
      'flex';


    const loggedName =
      document.getElementById(
        'logged-name'
      );


    const loggedEmail =
      document.getElementById(
        'logged-email'
      );


    if (loggedName) {

      loggedName.textContent =
        user.user_metadata?.nome ||
        'Usuário';

    }


    if (loggedEmail) {

      loggedEmail.textContent =
        user.email || '';

    }

  } else {

    loggedUser.style.display =
      'none';

  }

}


// ======================================================
// CONFIGURAR LOGIN / CADASTRO
// ======================================================

function configurarAutenticacao() {

  const form =
    document.getElementById(
      'user-form'
    );


  if (!form) {
    return;
  }


  const tabCadastro =
    document.getElementById(
      'tab-cadastro'
    );


  const tabLogin =
    document.getElementById(
      'tab-login'
    );


  const nomeGroup =
    document.getElementById(
      'nome-group'
    );


  const tipoGroup =
    document.getElementById(
      'tipo-group'
    );


  const title =
    document.getElementById(
      'auth-title'
    );


  const description =
    document.getElementById(
      'auth-description'
    );


  const button =
    document.getElementById(
      'auth-submit'
    );


  let modo = 'cadastro';


  // ====================================================
  // MODO CADASTRO
  // ====================================================

  function ativarCadastro() {

    modo = 'cadastro';


    tabCadastro.classList.add(
      'active'
    );

    tabLogin.classList.remove(
      'active'
    );


    nomeGroup.style.display =
      'flex';

    tipoGroup.style.display =
      'flex';


    document
      .getElementById('nome')
      .required = true;


    title.textContent =
      'Crie sua conta';


    description.textContent =
      'Crie sua conta para acessar seu espaço dentro do site.';


    button.textContent =
      'Criar minha conta →';

  }


  // ====================================================
  // MODO LOGIN
  // ====================================================

  function ativarLogin() {

    modo = 'login';


    tabLogin.classList.add(
      'active'
    );

    tabCadastro.classList.remove(
      'active'
    );


    nomeGroup.style.display =
      'none';

    tipoGroup.style.display =
      'none';


    document
      .getElementById('nome')
      .required = false;


    title.textContent =
      'Bem-vindo de volta';


    description.textContent =
      'Entre na sua conta para continuar.';


    button.textContent =
      'Entrar na minha conta →';

  }


  tabCadastro.addEventListener(
    'click',
    ativarCadastro
  );


  tabLogin.addEventListener(
    'click',
    ativarLogin
  );


  // ====================================================
  // ENVIO DO FORMULÁRIO
  // ====================================================

  form.addEventListener(
    'submit',
    async (event) => {

      event.preventDefault();


      const email =
        document
          .getElementById('email')
          .value
          .trim();


      const senha =
        document
          .getElementById('senha')
          .value;


      if (!email || !senha) {

        alert(
          'Preencha seu e-mail e sua senha.'
        );

        return;

      }


      button.disabled = true;

      button.textContent =
        modo === 'cadastro'
          ? 'Criando conta...'
          : 'Entrando...';


      try {

        // ==============================================
        // CADASTRO
        // ==============================================

        if (modo === 'cadastro') {

          const nome =
            document
              .getElementById('nome')
              .value
              .trim();


          const tipo_usuario =
            document
              .getElementById('tipo_usuario')
              .value;


          const {
            data,
            error
          } =
            await supabaseClient.auth.signUp({

              email,

              password: senha,

              options: {

                data: {

                  nome,

                  tipo_usuario

                }

              }

            });


          if (error) {
            throw error;
          }


          // Se a sessão foi criada
          if (data.session) {

            alert(
              'Conta criada com sucesso! 🔒'
            );


            window.location.href =
              'portfolio.html';

            return;

          }


          // Confirmação de e-mail ativada
          alert(
            'Conta criada! 📧 Verifique seu e-mail para confirmar a conta.'
          );


          ativarLogin();


          form.reset();

        }


        // ==============================================
        // LOGIN
        // ==============================================

        else {

          const {
            data,
            error
          } =
            await supabaseClient.auth
              .signInWithPassword({

                email,

                password: senha

              });


          if (error) {
            throw error;
          }


          if (data.session) {

            alert(
              'Login realizado com sucesso! 🔒'
            );


            window.location.href =
              'portfolio.html';

          }

        }

      } catch (error) {

        console.error(
          'Erro de autenticação:',
          error
        );


        alert(
          'Não foi possível concluir a operação:\n\n' +
          error.message
        );

      } finally {

        button.disabled = false;


        if (modo === 'cadastro') {

          button.textContent =
            'Criar minha conta →';

        } else {

          button.textContent =
            'Entrar na minha conta →';

        }

      }

    }
  );

}


// ======================================================
// LOGOUT
// ======================================================

async function fazerLogout() {

  if (!supabaseClient) {
    return;
  }


  const confirmar =
    confirm(
      'Deseja sair da sua conta?'
    );


  if (!confirmar) {
    return;
  }


  const {
    error
  } =
    await supabaseClient.auth.signOut();


  if (error) {

    alert(
      'Erro ao sair da conta: ' +
      error.message
    );

    return;

  }


  alert(
    'Você saiu da sua conta.'
  );


  window.location.href =
    'index.html';

}


// ======================================================
// PROJETOS
// ======================================================

async function loadProjects() {

  const projectsGrid =
    document.getElementById(
      'projects-grid'
    );


  if (!projectsGrid) {
    return;
  }


  if (!supabaseClient) {

    projectsGrid.innerHTML = `

      <div class="erro-projetos">

        <div class="erro-icone">
          ⚠️
        </div>

        <h3>
          Supabase não configurado
        </h3>

        <p>
          Verifique a conexão com o Supabase.
        </p>

      </div>

    `;

    return;

  }


  projectsGrid.innerHTML = `

    <div class="loading-projetos">

      <div class="loading-spinner"></div>

      <p>
        Carregando projetos...
      </p>

    </div>

  `;


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from('projetos')
        .select('*')
        .order(
          'id',
          {
            ascending: false
          }
        );


    if (error) {
      throw error;
    }


    if (!data || data.length === 0) {

      projectsGrid.innerHTML = `

        <div class="sem-projetos">

          <div style="font-size: 2rem;">
            📁
          </div>

          <h3>
            Nenhum projeto encontrado
          </h3>

          <p>
            Adicione seus projetos no Supabase.
          </p>

        </div>

      `;

      return;

    }


    projectsGrid.innerHTML =
      data.map(
        projeto => {

          const foto =
            projeto.foto ||
            'https://placehold.co/800x500/171329/a855f7?text=Projeto';


          const nome =
            projeto.nome ||
            'Projeto sem nome';


          const descricao =
            projeto.descricao ||
            'Sem descrição disponível.';


          const categoria =
            projeto.categoria ||
            'Projeto Web';


          return `

            <article class="project-card">

              <div class="project-image">

                <img
                  src="${foto}"
                  alt="${nome}"
                  onerror="
                    this.src='https://placehold.co/800x500/171329/a855f7?text=Projeto'
                  "
                >

                <span class="project-category">
                  ${categoria}
                </span>

              </div>

              <div class="project-content">

                <h3>
                  ${nome}
                </h3>

                <p>
                  ${descricao}
                </p>

                ${
                  projeto.link
                    ? `

                      <a
                        href="${projeto.link}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="project-button"
                      >
                        Ver projeto
                        <span>→</span>
                      </a>

                    `
                    : ''
                }

              </div>

            </article>

          `;

        }
      ).join('');


  } catch (error) {

    console.error(
      'Erro ao carregar projetos:',
      error
    );


    projectsGrid.innerHTML = `

      <div class="erro-projetos">

        <div class="erro-icone">
          ⚠️
        </div>

        <h3>
          Erro ao carregar projetos
        </h3>

        <p>
          Não foi possível acessar os projetos.
        </p>

      </div>

    `;

  }

}


// ======================================================
// FORMULÁRIO DE CONTATO
// ======================================================

document.addEventListener(
  'DOMContentLoaded',
  () => {

    const leadForm =
      document.getElementById(
        'lead-form'
      );


    if (!leadForm || !supabaseClient) {
      return;
    }


    leadForm.addEventListener(
      'submit',
      async (event) => {

        event.preventDefault();


        const nome =
          document
            .getElementById('lead-nome')
            .value
            .trim();


        const email =
          document
            .getElementById('lead-email')
            .value
            .trim();


        const telefone =
          document
            .getElementById('lead-tel')
            .value
            .trim();


        const servico_interesse =
          document
            .getElementById('lead-servico')
            .value;


        const orcamento_estimado =
          document
            .getElementById('lead-orcamento')
            .value;


        const assunto =
          document
            .getElementById('lead-assunto')
            .value
            .trim();


        const {
          error
        } =
          await supabaseClient
            .from('leads')
            .insert([{

              nome,

              email,

              telefone,

              servico_interesse,

              orcamento_estimado,

              assunto

            }]);


        if (error) {

          alert(
            'Erro ao enviar mensagem: ' +
            error.message
          );

          return;

        }


        alert(
          'Mensagem enviada com sucesso! ✅'
        );


        leadForm.reset();

      }
    );

  }
);