export async function register(file: string, props: any): Promise<any> {
  var method = "POST";
  var action = "register";

  if (props.id !== undefined) {
    method = "UPDATE";
    action = method.toLowerCase();
  }

  let url = `http://localhost/produtosLike/${action}/${file}.php`;

  const requester = {
    method: method,
    headers: {
      "Content-Type": "applications/json; charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(props),
  };

  try {
    const response = await fetch(url, requester);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  } finally {
    console.info("Fim da requisição");
  }
}