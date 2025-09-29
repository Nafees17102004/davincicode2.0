import react from 'react';
import { useState } from 'react';

function SnippetPage(){

    const {snippetId , setSnippetId}=useState(0);
    const {snippetData,setSnippetData}=useState([]);


    return <div>
        <input type="number" />
        <button>submit</button>
     </div>
}

export default SnippetPage;