const serverApi = async (url) => {
    console.log(url);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
  
export default serverApi;
  