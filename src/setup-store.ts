import {flow, Instance, onAction, SnapshotIn, types} from 'mobx-state-tree'

export interface RootStore extends Instance<typeof RootStoreModel> {
}

export interface RootStoreSnapshot extends SnapshotIn<typeof RootStoreModel> {
}

export interface IndexStore extends Instance<typeof IndexStoreModel> {
}

export interface IndexStoreSnapshot extends SnapshotIn<typeof IndexStoreModel> {
}

export interface Cat extends Instance<typeof CatModel> {
}

export interface CatSnapshot extends SnapshotIn<typeof CatModel> {
}

const CatModel = types.model('Cat', {
    name: types.string,
    age: types.number
})

const IndexStoreModel = types.model('IndexStore', {
    catIndex: types.map(CatModel)
})

const RootStoreModel = types.model('RootStore', {
        appTitle: types.string,
        indexStore: types.optional(IndexStoreModel, {} as any),
        blergh: types.frozen(),
        sortDirection: types.optional(types.string, 'ascending'),
        sortCriteria: types.optional(types.string, 'name')
    })
    .actions(
        (self) => ({
            initialiseStore: flow(
                function* initialiseStore(snapshotPromise: Promise<any>) {
                    try {
                        // const snapshot = yield snapshotPromise
                        self.blergh = yield fetch('https://jsonplaceholder.typicode.com/todos/1')
                            .then(response => response.json())
                        console.log(self)
                        // console.log('Loaded snapshot', snapshot)
                        // for (const catIndexKey in snapshot.indexStore.catIndex) {
                        //     self.indexStore.catIndex.set(catIndexKey, snapshot.indexStore.catIndex[catIndexKey])
                        //     console.log('Index Store: ', self.indexStore.catIndex)
                        // }
                    } catch (e) {
                        console.log(e)
                    }
                }
            ),
            toggleSortDirection() {
                self.sortDirection === 'ascending'
                ? self.sortDirection = 'descending'
                : self.sortDirection = 'ascending'
            },
            addCatToCatIndex() {
                const key = `cat-00${Math.random().toString()}`
                self.indexStore.catIndex.set(key, {
                    name: `Kitmo-${Math.round(Math.random() * 100)}`,
                    age: Math.round(Math.random() * 100)
                })
            },
            setSearchCriteria(criteria: 'name' | 'age') {
                self.sortCriteria = criteria
            }
        })
    ).views(
        (self) => ({
                get getCats() {
                    return self.indexStore.catIndex
                },
                getCatsOrderedByCriteria(direction: 'ascending' | 'descending', criteria: 'age' | 'name'): Cat[] {
                    // const direction = self.sortDirection || 'ascending'
                    console.log('CATS VIEW CALLED')

                    // let catsSnapshot = getSnapshot(self.indexStore.catIndex)
                    // console.log(catsSnapshot)
                    // let cats = []

                    // for (const catKey in catsSnapshot) {
                    //     if (catsSnapshot.hasOwnProperty(catKey)) {
                    //         cats.push(catsSnapshot[catKey])
                    //     }
                    // }

                    let cats = [...self.indexStore.catIndex.values()]
                    let sortedCats

                    console.log(direction, self.sortCriteria)
                    switch (criteria) {
                        case 'name': {
                            sortedCats = cats
                                .sort(
                                    (a, b) =>
                                        a.name.toLowerCase() < b.name.toLowerCase() ?
                                        -1 : a.name.toLowerCase() === b.name.toLowerCase() ?
                                             0 : 1
                                )
                            break
                        }
                        case 'age': {
                            sortedCats = cats
                                .sort((a, b) => a.age - b.age)
                            break
                        }
                        default: {
                            sortedCats = cats
                            break
                        }
                    }
                    if (direction === 'descending') {
                        sortedCats.reverse()
                    }
                    console.log('Sorted cats: ', sortedCats)
                    return sortedCats
                }
            }
        )
    )

const setupStore: () => Promise<RootStore> = async () => {

    let store

    const cache: Promise<RootStoreSnapshot> = new Promise((resolve) => {
        resolve({
            appTitle: 'MobX Playground',
            indexStore: {
                catIndex: {
                    'cat-001': {
                        name: 'Fluffles',
                        age: 10
                    },
                    'cat-002': {
                        name: 'Boggles',
                        age: 4
                    }
                }
            }
        })
    })
    try {
        store = RootStoreModel.create(await cache)
    } catch (e) {
        console.warn('Failed to create store with cache', e.stack)
        store = RootStoreModel.create({
            appTitle: 'App without Init',
            indexStore: {
                catIndex: {}
            }
        })
        await store.initialiseStore(cache)
        console.log(store)


    }
    onAction(store, (call) => {
        console.log('Action was called: ', call.name, call)
    })

    return store
}

export default setupStore
