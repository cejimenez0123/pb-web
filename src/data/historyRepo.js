class HistoryRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    url=Enviroment.url+"/history"
    token="token"

    async storyCreate({profile,story}){

    }
    async collectionCreate({profile,collection}){
        
    }
}
export default new HistoryRepo()