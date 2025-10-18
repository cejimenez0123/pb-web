import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonModal,
  IonText,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonBackButton,
} from '@ionic/react';
import { searchMultipleIndexes } from '../actions/UserActions';
import { searchDialogToggle } from '../actions/UserActions';
import { useSelector, useDispatch } from 'react-redux';
import checkResult from '../core/checkResult';
import { useNavigate } from 'react-router-dom';

const SearchDialog = ({presentingElement}) => {
  const modal = useRef(null);

  const searchDialogOpen = useSelector(state => state.users.searchDialogOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  // Your business search content state/hooks
  const [searchText, setSearchText] = useState('');
  const [searchContent, setSearchContent] = useState([]);

  // useEffect(() => {
  //   setPresentingElement(page.current);
  // }, []);

  // Example: fetch or filter business data based on searchText
  useEffect(() => {
    // Replace this with your actual dispatch or search function
    if (searchText.trim().length === 0) {
      setSearchContent([]); // Empty or default results
      return;
    }
    dispatch(searchMultipleIndexes({query:searchText})).then(result => {checkResult(result,payload=>{

  
      const {results}=payload
                          let items = results.map(element => {
                              let index = element.index
                             return element.hits.map(hit=>{
                                 let searchItem = {type:index}        
                                   Object.keys(hit).forEach(key=>{
                                      searchItem[key] = hit[key]
                                   })
                              
                                  return searchItem
                              })
                          
                          })
                          setSearchContent(items.flat())
                          ;
                        },err=>{
                          
                        })});
  }, [searchText, dispatch]);

  const dismiss = () => {
    modal.current?.dismiss();
    // Add any additional close logic if needed
  };


  // Your click handler for search results
  const handleOnClick = (searchItem)=>{
 
                dispatch(searchDialogToggle({open:false}))
                navigate(`/${searchItem.type}/${searchItem.objectID}`)
                
         }

  return(<IonModal
  isOpen={searchDialogOpen}
title='Search'

  onDidDismiss={()=>dispatch(searchDialogToggle({open:false}))}
  cssClass="modal-fullscreen ion-padding"
  presentingElement={presentingElement}
  style={{backgroundColor:"white",height:"100vh",overflowY:"scroll"}}
  swipeToClose={true}
><IonHeader>

    <IonToolbar className=''>
     
      <IonButtons slot="start">
        <IonBackButton onClick={()=>dispatch(searchDialogToggle({open:false}))}/>
      </IonButtons>
    </IonToolbar>
    <IonToolbar>
      <input
      className='bg-transparent w-[100%] my-3 px-2 h-[2rem] border-emerald-400 rounded-full border-1'
      style={{flex:"auto",backgroundColor:"transparent"}}
        value={searchText}
        onChange={e => setSearchText(e.target.value ?? '')}
        debounce={300}
        placeholder='Search...'
      />
    </IonToolbar>
  
    </IonHeader>
  {/* <IonContent> */}
      
          <IonList style={{overflowY:"scroll"}}className='flex flex-col l'>
            {searchContent.length > 0 ? (
              searchContent.map((content, i) => (
                <IonItem
                 
                  key={i}
                  className='bg-transparent my-2 pb-2 border-emerald-300 border-b border-1'
                  onClick={() => handleOnClick(content)}
                >
                  <IonText className='text-emerald-800 '>
                    {content.title || content.username || content.name || "Untitled"}

                  </IonText>
                </IonItem>
              ))
            ) : (
              <IonItem >
                <IonLabel className='text-emerald-600'>No results found</IonLabel>
              </IonItem>
            )}
          </IonList>
        {/* </IonContent> */}
      </IonModal>

  );
};

export default SearchDialog;

