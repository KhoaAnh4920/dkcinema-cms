import React, { useState } from 'react';
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import { selectLanguage } from "../redux/userSlice";
import { selectUser } from "../redux/userSlice";


import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
//import '@formatjs/intl-pluralrules/locale-data/vi';

import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/en';
//import '@formatjs/intl-relativetimeformat/locale-data/vi';


import { LanguageUtils } from '../utils';

const messages = LanguageUtils.getFlattenedMessages();




function IntlProviderWrapper(props) {
    const { children } = props;
    const language = useSelector(selectLanguage);
    let user = useSelector(selectUser);

    //  console.log('language: ', language);

    return (
        <>
            <IntlProvider
                locale={language}
                messages={messages[language]}
                defaultLocale="vi">
                {children}
            </IntlProvider>
        </>
    );
}

export default IntlProviderWrapper;