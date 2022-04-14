export default function fail() {
  return (
    <div className="error">
      <h1>
        Erreur 404,<br></br>page introuvable.{" "}
        <form method="GET" action="/">
          <button className="btn btn-success ">Back Home to the ninety</button>
        </form>
      </h1>
      <img src="/undraw_Taken_re_yn20.png" alt="" />
    </div>
  );
}
