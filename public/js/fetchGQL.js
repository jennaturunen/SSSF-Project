const fetchGraphql = async (query) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: JSON.stringify(query),
  };

  try {
    const response = await fetch('http://localhost:3000/graphql', options);
    console.log('reeee', response);
    const json = await response.json();
    return json.data;
  } catch (e) {
    console.log('fetchgraphql', e.message);
    return false;
  }
};
