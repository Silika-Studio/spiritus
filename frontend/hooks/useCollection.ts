
import React, { useContext } from 'react';
import { Collection } from '../types';


export const CollectionContext = React.createContext<{
    collection: Collection;
    setCollection: (collection: Collection) => void;
}>({
    collection: {} as any,
    setCollection: () => { }

});

export const useCollection = () => {
    const context = useContext(CollectionContext);

    return context;
};