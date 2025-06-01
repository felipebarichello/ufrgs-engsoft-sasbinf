// import { useState } from "react";
// import reactLogo from "#svgs/react.svg";
// import viteLogo from "/vite.svg";

// function ReactExamplePage() {
//   // Chama a query do RTK

//   // State para o contador
//   const [count, setCount] = useState(0);

//   // Estado de carregamento
//   if (getHealth.isLoading) {
//     return <>PAGINA CARREGANDO...</>;
//   }

//   // Estado de erro
//   if (getHealth.isError) {
//     console.error("Erro ao carregar os dados:", getHealth.error); // Imprime o erro no console
//     return <>ERRO AO CARREGAR A PÁGINA. TENTE NOVAMENTE!</>;
//   }

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React + API Call</h1>
//       {/* Exibe dados da API, se presentes */}

//       {/* Contador padrão do Vite */}
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   );
// }

// export default ReactExamplePage;
