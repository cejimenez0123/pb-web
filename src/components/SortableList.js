import {SortableContainer, SortableElement,sortableHandle} from 'react-sortable-hoc';
import {arrayMoveImmutable,arrayMoveMutable }from 'array-move';
import { Remove,DragIndicator } from "@mui/icons-material"
import {IconButton} from "@mui/material"
import { Component, useState } from 'react';
import { useEffect } from 'react';
const SortableItem = SortableElement(({value,handleRemove,index}) =>{
    const {item } = value
    if(item){
           
            
        return(
<div>
            <div key={`${value.uId}`}className="sort-item">
            <h5>{item.title}</h5>
            <div className="button-row">
       <IconButton onClick={()=>{
        handleRemove(index)}}>
        <Remove/>
       </IconButton>
       <DragHandle/>
            </div>
        </div>
        </div>)
        
    }else{

    return(
    <div><div key={`${value.uId}`} className="sort-item">  
            <h1>Page Deleted</h1>
           </div> </div>
    )
    }
    });
    const targetHasProp = (
        target,
        hasProp,
      ) => {
        while (target) {
          if (hasProp(target)) {
            return true;
          }
          // eslint-disable-next-line no-param-reassign
          target = target.parentElement;
        }
        return false;
      };
const shouldCancelSortStart = (coach)=> {
        // Cancel sort if a user is interacting with a given element
        return targetHasProp(coach.target , (el) => {
          return ['button'].includes(el.tagName.toLowerCase());
        });
      };
const SortableList = SortableContainer(({items,handleRemove}) => {
  return (
    <ul>
      {items.map((value, index) => {
       return( <div>
        <SortableItem key={`item-`+value.uId} handleRemove={()=>{
         
            handleRemove(value,index)
        }} index={index} idx={index} value={value} />
        </div> )})}
    </ul>
  );
});
const DragHandle = sortableHandle(() => <IconButton>
<DragIndicator/>
</IconButton>);

// class SortableComponent extends Component {
//   state = {
//     items: [],
//   };
  
//   componentDidMount(){
//     this.setState((state)=>({items:this.props.items}))
//   }
 
//   onSortEnd = ({oldIndex, newIndex}) => {
  
//     this.setState(({items}) => ({
//       items:arrayMoveImmutable(items, oldIndex, newIndex)
//     }));


//   };

  
//   remove(value) {
    
//                         let items = this.state.items;
//                         let newItems =items.filter(item=>item!== value)
                
                   
//                         this.setState({items : newItems})
//                         this.props.getItems(newItems)        
// }
//   render() {
//     return(<div>
//         <SortableList axis="y" 
//         useDragHandle
//                     items={this.state.items} 
//                     shouldCancelSortStart={shouldCancelSortStart}
//                     handleRemove={(value,index)=>{
                       
//                     this.remove(value)
//                 }}
//                     onSortEnd={this.onSortEnd} />
//         </div> );}
// }

const SortableComponent = ({ items, getItems }) => {
  const [newItems, setNewItems] = useState( []
  );
  useEffect(() => {
    setNewItems(items);
  }, [items]);
  useEffect(()=>{
    getItems(newItems)}
    ,[newItems])
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setNewItems((prevState) => {
       let list = prevState
        return arrayMoveImmutable(list, oldIndex, newIndex)
    });
  };
  const remove = (value) => {
    const newtems = items.filter((item) => item !== value);
    setNewItems(newtems);
  };

  


  return (
    <div>
      <SortableList
        axis="y"
        useDragHandle
        items={newItems}
        shouldCancelSortStart={shouldCancelSortStart}
        onSortEnd={onSortEnd}
        handleRemove={(value) => remove(value)}
      />
    </div>
  );
};


export default SortableComponent