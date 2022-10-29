import { useCallback, useEffect, useState } from 'react';

import Typewriter from 'typewriter-effect';

// TODO: this type is wrong
type TypewriterOptions = any;

interface Props extends TypewriterOptions {
    strings: string[];
    loop?: boolean;
    initialDelay?: number;
    endOfLoopDelay?: number;
    onEndOfRender?: () => void;
}

const CustomTypewriter = (props: Props) => {
    const { strings, loop, endOfLoopDelay, initialDelay, onEndOfRender: externalOnEndOfRender, ...otherTypewriterOptions } = props;

    const [shouldRender, setShouldRender] = useState(!initialDelay);

    const singleStringWithoutLoop = strings.length === 1 && !loop;

    const onEndOfRender = useCallback((node: HTMLDivElement) => {
        setTimeout(() => {
            const typewriter = node && node.children[0];

            if (!loop && typewriter && typewriter.children[0].innerHTML === strings[0]) {
                typewriter.children[1].addEventListener('animationiteration', () => {
                    const cursor = typewriter?.children[1] as (HTMLSpanElement | undefined);

                    if (externalOnEndOfRender) {
                        externalOnEndOfRender();
                    }

                    if (cursor) {
                        cursor.style.animation = 'Typewriter-cursor 1s';
                        cursor.style.opacity = '0%';
                    }
                });
            }
        }, endOfLoopDelay ?? 250);
    }, [loop, externalOnEndOfRender, endOfLoopDelay, strings]);

    const domRef = useCallback((node: HTMLDivElement) => {
        if (!node|| !singleStringWithoutLoop) return;

        const observer = new MutationObserver(() => onEndOfRender(node));
        const config = { attributes: true, childList: true, subtree: true };

        observer.observe(node, config);

        return () => {
            observer.disconnect();
        };
    }, [onEndOfRender, singleStringWithoutLoop]);

    useEffect(() => {
        if (initialDelay) {
            setTimeout(() => {
                setShouldRender(true);
            }, initialDelay);
        }
    }, [initialDelay]);

    if (!shouldRender) {
        return <>{' '}</>;
    }

    return (
        <div ref={domRef}>
            <Typewriter
                onInit={singleStringWithoutLoop ? (typewriter) => {
                    typewriter.typeString(strings[0]).start();
                } : undefined}
                options={{
                    ...(singleStringWithoutLoop ? {} : {
                        strings,
                        autoStart: true,
                        loop,
                    }),
                    ...otherTypewriterOptions,
                }}
            />
        </div>
    );
};

export default CustomTypewriter;
