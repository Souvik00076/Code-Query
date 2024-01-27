import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/swift/swift';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/php/php';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/perl/perl';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-palenight.css';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
import xml from 'highlight.js/lib/languages/xml';
import go from 'highlight.js/lib/languages/go';
import css from 'highlight.js/lib/languages/css';
import perl from 'highlight.js/lib/languages/perl';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('python', python);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('php', php);
hljs.registerLanguage('css', css);
hljs.registerLanguage('go', go);
hljs.registerLanguage('perl', perl);

const Editor = ({ data , editorId}) => {
  const languageDetected = hljs.highlightAuto(data.text).language
  console.log(languageDetected)
  const editorRef = useRef(null)

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = CodeMirror(document.getElementById(editorId), {
        mode: { name: languageDetected},
        theme: 'material-palenight',
        readOnly: true,
        scrollbarStyle: null,
        showCursorWhenSelecting: false,
        cursorBlinkRate: -1,
      })
    }
    editorRef.current.setSize('100%','auto')
    editorRef.current.setValue(data.text)
  })

  return (
    <div id={editorId}></div>
  );
};

export default Editor;
