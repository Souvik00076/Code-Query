import React from 'react';
import ReactDOM from 'react-dom/client'; // Fix the import statement
import App from './App';
import './styles.scss'

const root = ReactDOM.createRoot(document.getElementById('root')); // Use React.createRoot

const Index = () => {
    return (
        <>
            <App />
        </>
    );
}

root.render(<Index />);

