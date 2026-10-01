// ======================================================
// CONFIGURAÇÃO DO SUPABASE
// ======================================================

const SUPABASE_URL = 'https://uoqvnwkcvctbaujalprc.supabase.co';

const SUPABASE_KEY =
  'sb_publishable_x7mGxz7QtNNB1JAAZIpPew_UsJ1RDb2';


// ======================================================
// CONEXÃO COM O SUPABASE
// ======================================================

let supabaseClient = null;

if (
  SUPABASE_URL &&
  SUPABASE_KEY
) {

  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  console.log('✅ Supabase conectado com sucesso!');

} else {

  console.warn(
    '⚠️ Supabase não configurado. Verifique a URL e a Publishable Key.'
  );

}


// ======================================================
// QUANDO A PÁGINA CARREGAR
// ======================================================

document.addEventListener('DOMContentLoaded', () => {

  // Atualiza o ano do rodapé
  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  // Carrega os projetos
  const projectsGrid =
    document.getElementById('projects-grid');

  if (projectsGrid) {
    loadProjects();
  }

});


// ======================================================
// CARREGAR PROJETOS DO SUPABASE
// ======================================================

async function loadProjects() {

  const projectsGrid =
    document.getElementById('projects-grid');

  if (!projectsGrid) {
    return;
  }


  // Verifica conexão
  if (!supabaseClient) {

    projectsGrid.innerHTML = `
      <div class="erro-projetos">

        <div class="erro-icone">⚠️</div>

        <h3>Supabase não configurado</h3>

        <p>
          Verifique a URL e a chave pública
          no arquivo script.js.
        </p>

      </div>
    `;

    return;
  }


  // Mensagem de carregamento
  projectsGrid.innerHTML = `
    <div class="loading-projetos">

      <div class="loading-spinner"></div>

      <p>Carregando projetos...</p>

    </div>
  `;


  try {

    const { data, error } = await supabaseClient
      .from('projetos')
      .select('*')
      .order('id', {
        ascending: false
      });


    // ==================================================
    // ERRO AO BUSCAR PROJETOS
    // ==================================================

    if (error) {

      console.error(
        'Erro ao buscar projetos:',
        error
      );

      projectsGrid.innerHTML = `
        <div class="erro-projetos">

          <div class="erro-icone">⚠️</div>

          <h3>Erro ao carregar projetos</h3>

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


    // ==================================================
    // NENHUM PROJETO
    // ==================================================

    if (!data || data.length === 0) {

      projectsGrid.innerHTML = `
        <div class="sem-projetos">

          <div>📁</div>

          <h3>Nenhum projeto encontrado</h3>

          <p>
            Adicione seus projetos na tabela
            "projetos" do Supabase.
          </p>

        </div>
      `;

      return;
    }


    // ==================================================
    // CRIAR CARDS DOS PROJETOS
    // ==================================================

    projectsGrid.innerHTML = data.map(projeto => {

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
              onerror="this.src='https://placehold.co/800x500/171329/a855f7?text=Projeto'"
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

    }).join('');


  } catch (error) {

    console.error(
      'Erro inesperado:',
      error
    );

    projectsGrid.innerHTML = `
      <div class="erro-projetos">

        <div class="erro-icone">⚠️</div>

        <h3>Erro inesperado</h3>

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

const userForm =
  document.getElementById('user-form');

if (userForm) {

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
        document.getElementById('nome').value.trim();

      const email =
        document.getElementById('email').value.trim();

      const senha =
        document.getElementById('senha').value;

      const tipo_usuario =
        document.getElementById('tipo_usuario').value;


      // Cadastro usando o Supabase Auth
      const { data, error } =
        await supabaseClient.auth.signUp({

          email: email,

          password: senha,

          options: {

            data: {
              nome: nome,
              tipo_usuario: tipo_usuario
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


// ======================================================
// FORMULÁRIO DE CONTATO
// ======================================================

const leadForm =
  document.getElementById('lead-form');

if (leadForm) {

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


      const { error } =
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