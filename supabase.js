const SUPABASE_URL = "https://jajmyddkjghnnswzdgfu.supabase.co/rest/v1/";

const SUPABASE_KEY = "sb_publishable_G8OtzWVlxn2FldD6K2IYpA_geRkYzoc";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function testarConexao() {
  const { error } = await supabaseClient
    .from("propriedades")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Erro na conexão:", error.message);
  } else {
    console.log("DroneCultivo conectado ao Supabase!");
  }
}

testarConexao();
