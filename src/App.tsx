import React, { useCallback, useState } from 'react';

import './App.css';
import CustomTypewriter from './components/CustomTypewriter';

const items = [
    {
        text: 'We are Innova Cloud'
    },
    {
        text: 'We develop innovative cloud solutions'
    },
    {
        text: 'We are building WeCrowd',
        link: 'https://wecrowd.it'
    },
    {
        text: 'We are building EduBooking'
    },
    {
        text: 'We developed Ristor Service App',
        link: 'https://ristorserviceapp.com'
    }
];

function App() {
    const [link, setLink] = useState<string | null>(null);

    const updateLink = useCallback((node: HTMLAnchorElement) => {
        const typewriterText = node && node.children[0].children[0].children[0].innerHTML;

        const matchingItems = items.filter(i => {
            return i.text.startsWith(typewriterText ?? '');
        });

        setLink((matchingItems.length === 1 && matchingItems[0].link) ? matchingItems[0].link : null);
    }, []);

    const typewriterRef = useCallback((node: HTMLAnchorElement) => {
        if (!node) return;

        const observer = new MutationObserver(() => updateLink(node));
        const config = { attributes: true, childList: true, subtree: true };

        observer.observe(node, config);

        return () => {
            observer.disconnect();
        };
    }, [updateLink]);

    return (
        <div className='App'>
            <header className='App-header'>
                <table width='100%' style={{height: '100%', flexGrow: 1}} border={0} cellPadding='0' cellSpacing='0'>
                    <tr>
                        <td>
                            <div style={{fontSize: '3.4em', margin: '0', display: 'block'}}>
                                <CustomTypewriter strings={['Hello World!']} loop={false} endOfLoopDelay={2000} />
                            </div>

                            <a href={link ?? ''} rel='noreferrer' target={'_blank'} ref={typewriterRef}
                                style={{
                                    fontSize: '2em',
                                    margin: '16px 0',
                                    color: 'unset',
                                    textDecoration: 'none',
                                    cursor: link ? 'pointer' : 'initial',
                                    display: 'block'
                                }}
                                onClick={(e: React.SyntheticEvent) => {
                                    if (!link) {
                                        e.preventDefault();
                                        return false;
                                    }
                                }}
                            >
                                <CustomTypewriter
                                    strings={items.map(i => i.text)}
                                    endOfLoopDelay={4000}
                                    loop={true}
                                    initialDelay={4000}
                                    pauseFor={3000}
                                />
                            </a>

                            <a href={'mailto:hello@innovacloud.io'} rel='noreferrer' target={'_blank'}
                                style={{
                                    fontSize: '0.85em',
                                    margin: '28px 0',
                                    color: 'unset',
                                    textDecoration: 'none',
                                    display: 'block',
                                    opacity: '90%'
                                }}
                            >
                                <CustomTypewriter
                                    strings={['hello@innovacloud.io']}
                                    endOfLoopDelay={4000}
                                    loop={false}
                                    initialDelay={8000}
                                />
                            </a>
                        </td>
                    </tr>
                </table>

                <div style={{textAlign: 'left', fontSize: '0.5em', marginBottom: '8px', width: 'calc(100% - 16px)', opacity: '75%', minHeight: '16px'}}>
                    <CustomTypewriter
                        strings={['Innova Cloud è un marchio di Cristian Livella, CF: LVLCST01C14A794K, P. IVA: IT04368210169']}
                        endOfLoopDelay={2000}
                        initialDelay={8000}
                        loop={false}
                    />
                </div>
            </header>
        </div>
    );
}

export default App;
