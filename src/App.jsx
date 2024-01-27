import React, { useEffect, useState, useRef } from 'react';
import useFetch from './hooks/UseFetchHook';
import Editor from './components/Editor';

const App = () => {
  const [prompt, setPrompt] = useState({data:null,usage_flag:false});
  const [input, setInput] = useState('Search');
  const [editors, setEditors] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)

  const response = useFetch(prompt);
  const containerRef = useRef(null);
  const inputRef=useRef(null)

  useEffect(() => {
    if (response.data) {
      setEditors((prevEditor) => [...prevEditor, {flag:0,text:response.data[0]}]);
    }
  }, [response.data]);



  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollHeight = container.scrollHeight;
      const currentScroll = container.scrollTop;
      const targetScroll = scrollHeight - container.clientHeight;
      const startTime = performance.now();
      const duration = 500; // Adjust the duration as needed (in milliseconds)
  
      const animateScroll = (timestamp) => {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        container.scrollTop = currentScroll + progress * (targetScroll - currentScroll);
  
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      requestAnimationFrame(animateScroll);
    }
  }, [editors]);
  const fetchData = () => {
    setPrompt({...prompt,data:input,usage_flag:false});
    setEditors((prevEditor) => [...prevEditor, { flag: 1, text: input }]);
    setInput('Search');
  };
  const handleInputEnter = (e) => {
    if (e.code === 'Enter') {
      fetchData();
      e.target.blur()
    }
  };
  const handleChange = (e) => setInput(e.target.value);
  const handleImageSelect=()=>{
    inputRef.current.click();
  }

  const handleImageChange=(event)=>{
    const selectedFile = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(selectedFile.type)) {
    setPrompt({data:selectedFile,usage_flag:true})
    setEditors((prevEditor) => [...prevEditor, { flag: 2, text: URL.createObjectURL(selectedFile) }])
    }
    else 
    alert('Please select a JPEG, JPG, or PNG image file.');
  }

  return (
    <div className='flex mx-auto flex-col items-center justify-between h-screen'>
      <p className='text-6xl mt-4  text-center font-bold text-white'>
        Code Query
      </p>
      
      <div className='w-[90%] sm:w-[60%] h-full overflow-y-scroll no-scrollbar mt-4 sm:mt-6 py-6' ref={containerRef}>
        {editors.length > 0 && (
          <ul>
            {editors.map((item, idx) => (
              <li key={idx}>
                <div className={`border-2 ${item.error}? border-red-600: border-teal-500   mt-6 px-4 py-2  rounded-xl`}>
                  {(item && item.flag===1 && item.text) && (
                    <div className='text-white'>{item.text}</div>
                  )}
                  {(item && item.flag==0 && item.text) && (
                    <Editor editorId={idx} data={item.text} />
                  )}
                  {
                    (item && item.flag==2 && item.text) &&(
                      <div><img src={item.text} alt={idx} /></div>
                    )
                  }
                  {
                    
                    (item && item.error) && (
                      <div>{item.error}</div>
                    )

                  }
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
  <div className='w-[90%] sm:w-[60%] mt-6 mb-6'>
  <div className='flex items-center relative'>
    <input
      className='w-full bg-black bg-opacity-30 rounded-full px-2 py-2 text-white font-bold placeholder-white focus:outline-none'
      value={input}
      onChange={handleChange}
      onKeyUp={handleInputEnter}
      onFocus={() => setInput('')}
    />
    <div className='absolute right-16 flex flex-row items-center'>
    <div>
    <img

      src={process.env.PUBLIC_URL + './icons/icons8-image-50.png'}
      alt='image-selection-button'
      className='mr-2 h-6 w-6 cursor-pointer'
      onClick={handleImageSelect}
      />

      <input type='file' 
      ref={inputRef} 
      onChange={handleImageChange}
      className='hidden'
      />
    </div>
    <img
    className='h-6 w-8 cursor-pointer'
    src={process.env.PUBLIC_URL+'./icons/icons8-microphone-64.png'}
    alt='image-audio-button'
    />
    </div>
    <img 
    className='ml-2' 
    src={process.env.PUBLIC_URL+'./icons/icons8-send-48.png'} 
    alt='image-button'
    />    
    </div>
  </div>
</div>
  );
};
export default App;

