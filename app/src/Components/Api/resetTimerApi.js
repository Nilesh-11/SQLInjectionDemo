const resetApi = async ({ uid }, url) => {
    console.log(uid, url);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"uid": uid})
      });
      if (response.ok) {
        const responseData = await response.json();
        if (!responseData) {
          throw new Error(responseData ? responseData.message : 'No data fetched');
        }
        return responseData;
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
};
  
export default resetApi;
  