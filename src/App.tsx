import React, {FunctionComponent, useEffect, useState} from 'react'
import {observer}                                      from 'mobx-react'
import setupStore, {RootStore}                         from './setup-store'

const App: FunctionComponent = () => {

    const [rootStore, setRootStore] = useState<RootStore>()

    // const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending')
    // const [sortCriteria, setSortCriteria] = useState<'age' | 'name'>('age')

    const sortDirection: 'ascending' | 'descending' = rootStore?.sortDirection as 'ascending' | 'descending' || 'ascending'
    const sortCriteria: 'age' | 'name' = rootStore?.sortCriteria as 'age' | 'name' || 'age'

    const handleToggleSortDirection = () => {
        if (rootStore) {
            rootStore.toggleSortDirection()
        }
    }

    const handleAddCat = () => {
        if (rootStore) {
            rootStore.addCatToCatIndex()
        }
    }

    const handleSetSortCriteria = (criteria: 'name' | 'age') => {
        if (rootStore) {
            rootStore.setSearchCriteria(criteria)
        }
    }

    useEffect(() => {
            setupStore().then((store) => setRootStore(store))
        }, []
    )

    useEffect(() => console.log('Rerendered'))

    return (
        <section style={{margin: '1rem'}}>
            {
                rootStore ? (
                    <section>
                        <button onClick={() => handleToggleSortDirection()}>Toggle Sort</button>
                        <button onClick={() => handleAddCat()}>Add Cat</button>
                        <button onClick={() => handleSetSortCriteria('name')}>Sort By
                            Name {rootStore.sortCriteria === 'name' ? '*' : ''}</button>
                        <button onClick={() => handleSetSortCriteria('age')}>Sort By
                            Age {rootStore.sortCriteria === 'name' ? '' : '*'}</button>
                        <h1>Playground: {rootStore.appTitle}</h1>
                        <ul>
                            {
                                rootStore.getCatsOrderedByCriteria(sortDirection, sortCriteria as any)
                                    .map((cat) => (
                                            <li>{cat.name} - {cat.age}</li>
                                        )
                                    )
                            }
                            {
                                /*
                                                                [...rootStore.getCats.entries()].map(([key, value]) => (
                                                                        <li key={key}>
                                                                            {value.name} aged {value.age}
                                                                        </li>
                                                                    )
                                                                )
                                */
                                /*
                                                                JSON.stringify(getSnapshot(rootStore.indexStore.catIndex))
                                */
                                /*                                [...rootStore.indexStore.catIndex.entries()].map(([key, value], index, array) => (
                                                                        <li key={key}>
                                                                            {value.name} aged {value.age}
                                                                        </li>
                                                                    )
                                                                )*/
                            }
                        </ul>
                    </section>
                ) : (
                    <h1>
                        Loading playground ...
                    </h1>
                )
            }
        </section>

    )
}

export default observer(App)
