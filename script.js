// ======================================================
// CONFIGURAÇÃO DO SUPABASE
// ======================================================

const SUPABASE_URL =
  'https://uoqvnwkcvctbaujalprc.supabase.co';

const SUPABASE_KEY =
  'sb_publishable_x7mGxz7QtNNB1JAAZIpPew_UsJ1RDb2';


// ======================================================
// CONEXÃO COM O SUPABASE
// ======================================================

let supabaseClient = null;


if (
  SUPABASE_URL &&
  SUPABASE_KEY &&
  window.supabase
) {

  supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

  console.log(
    '✅ Supabase conectado com sucesso!'
  );

} else {

  console.warn(
    '⚠️ Supabase não configurado.'
  );

}


// ======================================================
// QUANDO A PÁGINA CARREGAR
// ======================================================

document.addEventListener(
  'DOMContentLoaded',
  () => {

    // =========================
    // ANO DO RODAPÉ
    // =========================

    const year =
      document.getElementById('year');

    if (year) {

      year.textContent =
        new Date().getFullYear();

    }


    // =========================
    // PROJETOS
    // =========================

    const projectsGrid =
      document.getElementById(
        'projects-grid'
      );

    if (projectsGrid) {

      loadProjects();

    }

  }
);


// ======================================================
// CARREGAR PROJETOS
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
          Verifique a URL e a Publishable Key
          no arquivo script.js.
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
    } = await supabaseClient

      .from('projetos')

      .select('*')

      .order(
        'id',
        {
          ascending: false
        }
      );


    // =========================
    // ERRO
    // =========================

    if (error) {

      console.error(
        'Erro ao buscar projetos:',
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
            Não foi possível acessar a tabela
            "projetos".
          </p>

          <small>
            ${error.message}
          </small>

        </div>

      `;

      return;

    }


    // =========================
    // NENHUM PROJETO
    // =========================

    if (
      !data ||
      data.length === 0
    ) {

      projectsGrid.innerHTML = `

        <div class="sem-projetos">

          <div style="font-size: 2rem;">
            📁
          </div>

          <h3>
            Nenhum projeto encontrado
          </h3>

          <p>
            Adicione seus projetos na tabela
            "projetos" do Supabase.
          </p>

        </div>

      `;

      return;

    }


    // =========================
    // CARDS
    // =========================

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


          const link =
            projeto.link ||
            '#';


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
                        href="${link}"
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
      'Erro inesperado:',
      error
    );


    projectsGrid.innerHTML = `

      <div class="erro-projetos">

        <div class="erro-icone">
          ⚠️
        </div>

        <h3>
          Erro inesperado
        </h3>

        <p>
          Verifique a conexão com o Supabase.
        </p>

      </div>

    `;

  }

}


// ======================================================
// CADASTRO DE USUÁRIO
// ======================================================

document.addEventListener(
  'DOMContentLoaded',
  () => {

    const userForm =
      document.getElementById(
        'user-form'
      );


    if (!userForm) {

      return;

    }


    userForm.addEventListener(
      'submit',
      async (e) => {

        e.preventDefault();


        if (!supabaseClient) {

          alert(
            'Supabase não configurado.'
          );

          return;

        }


        const nome =
          document
            .getElementById('nome')
            .value
            .trim();


        const email =
          document
            .getElementById('email')
            .value
            .trim();


        const senha =
          document
            .getElementById('senha')
            .value;


        const tipo_usuario =
          document
            .getElementById('tipo_usuario')
            .value;


        // =========================
        // CADASTRO
        // =========================

        const {
          data,
          error
        } =
          await supabaseClient.auth.signUp({

            email: email,

            password: senha,

            options: {

              data: {

                nome:
                  nome,

                tipo_usuario:
                  tipo_usuario

              }

            }

          });


        if (error) {

          console.error(
            'Erro no cadastro:',
            error
          );


          alert(
            'Erro ao cadastrar usuário: ' +
            error.message
          );

          return;

        }


        console.log(
          'Usuário criado:',
          data
        );


        alert(
          'Usuário cadastrado com sucesso!'
        );


        userForm.reset();

      }
    );

  }
);


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


    if (!leadForm) {

      return;

    }


    leadForm.addEventListener(
      'submit',
      async (e) => {

        e.preventDefault();


        if (!supabaseClient) {

          alert(
            'Supabase não configurado.'
          );

          return;

        }


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


        // =========================
        // ENVIO PARA SUPABASE
        // =========================

        const {
          error
        } =
          await supabaseClient

            .from('leads')

            .insert([

              {

                nome,

                email,

                telefone,

                servico_interesse,

                orcamento_estimado,

                assunto

              }

            ]);


        if (error) {

          console.error(
            'Erro ao enviar mensagem:',
            error
          );


          alert(
            'Erro ao enviar mensagem: ' +
            error.message
          );

          return;

        }


        alert(
          'Mensagem enviada com sucesso!'
        );


        leadForm.reset();

      }
    );

  }
);