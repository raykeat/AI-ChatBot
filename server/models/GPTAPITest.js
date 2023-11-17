const testChatAPI = async () => {
    const prompt = "Give me a detailed roadmap to get a 6 figure software engineering job"; // Replace with your prompt
  
    try {
      const response = await fetch("http://localhost:6001/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response}`);
      }
  
      const data = await response.json();
      console.log(data.message);
    } 
    
    catch (error) {
      console.error("Error:", error);
    }
  };
  
  testChatAPI();
  