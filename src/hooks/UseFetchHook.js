import {useEffect, useState} from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai"
const getGenKey=()=>new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const fileToGenerativePart=async(file)=>{
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}
const fetchFromPro=async(prompt)=>{
 
  const genAI=getGenKey()
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })
  let response=undefined
  try{
    
    const result = await model.generateContent(prompt)
    console.log("called in vision3",prompt)
    response = result.response.candidates[0].finishReason.toUpperCase()==='STOP'?
               result.response.candidates[0].content?.parts:[{text:"Something went wrong",err:'YES'}]

    }catch(error){
        return error
    }
    console.log("called in vision2")
    return response
}
const fetchFromVision=async(prompt)=>{
    console.log("called in vision")
    let promptExtra='If this image contains coding quesions including database also provide only the code no description needed. Line Number not needed'
    if(prompt.promptExtra) promptExtra=prompt.promptExtra
    //code for vision goes here
    const genAI=getGenKey()  
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })
    const parts=await fileToGenerativePart(prompt.data)
    const result = await model.generateContent([promptExtra, [parts]])
    console.log(result.response.candidates[0].finishReason)
    const response=(result.response.candidates[0].finishReason.toUpperCase())==='STOP'?
                    result.response.candidates[0].content?.parts:[{text:"Something went wrong",err:"YES"}]
    console.log(response)
    return response
}
const fetchData=async(getPrompt)=>{
    const prompt=getPrompt()
    if(prompt.usage_flag===false){
    const promptExtra=prompt.data+' provide only the code no description needed.'
    const  response=await fetchFromPro(promptExtra)
    return response
    }
    let response=await fetchFromVision(prompt)
    return response
}
const useFetch=(prompt)=>{
    const [data,setData]=useState(null)
    const [error,setError]=useState(null)
    useEffect(()=>{
        if(prompt.data===null) return ;
        (
            async ()=>{
                try{ 
                const fetchedData=await fetchData(()=>prompt)
                setData(fetchedData)
                }catch(error){
                  console.log(error)
                    setError('Something error occured. Please try again later')
                }
            }
        )()
    },[prompt])
    return {data,error}
}

export default useFetch

















































/*
Closures in React:

When a React component renders, functions defined within it (like the useEffect callback) capture the values of variables from their surrounding scope at the time of creation.
These functions form closures, meaning they remember those captured values even when the component re-renders.
2. useEffect and Dependency Arrays:

The useEffect hook, when used with a dependency array, runs its callback effect after the component renders and whenever any of the values in the dependency array change.
However, the callback effect itself is still a closure, capturing variables from its surrounding scope when it was first created.
In your code:

Initial Render:

When the component renders for the first time, the useEffect callback is created and captures the initial value of prompt.
The effect runs, potentially logging the initial prompt and fetching data.
Subsequent Renders:

Even if the prompt value changes in subsequent renders, the useEffect callback still holds the initial prompt value it captured during the first render.
This means it will continue to log and use the same initial value, even though the component has a new prompt.
Solution: Use a Callback Function for prompt:

To address this issue and ensure the useEffect callback always uses the latest prompt value, pass a callback function to fetchData instead of directly passing prompt:

JavaScript
const useFetch = (prompt) => {
  // ... other code

  useEffect(() => {
    if (!prompt) return;

    (async () => {
      try {
        const fetchedData = await fetchData(() => prompt); // Pass a callback
        setData(fetchedData);
      } catch (error) {
        setError(error);
      }
    })();
  }, [prompt]);

  // ...
};

*/