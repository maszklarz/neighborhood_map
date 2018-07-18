
export const getByQuery = (query) =>
  fetch('http://api.nytimes.com/svc/search/v2/articlesearch.json?q='+
        query +
        '&api-key=d6700cb0508448b7add3ba241b735452')
  .then(response => response.json());
//   .then(response => {console.log(response)});
//   debugger;
//     // if(response.docs.length > 0) {
//     //   let htmlContent = '<ul>';
//     //   response.docs.forEach((doc) => {
//     //     htmlContent += `<li>
//     //     ${doc.snippet}
//     //     </li>`;
//     //     htmlContent += '</ul>'
//     //   });
//     //   console.log(htmlContent);
//     //   // responseContainer.insertAdjacentHTML('beforeend', htmlContent);
//     // }
// });
