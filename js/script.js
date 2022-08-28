

class User{
    constructor({id,name,email,addres,phone}){
        this.data={
            id,
            name,
            email,
            addres,
            phone
        }
    }
    edit(newData){
        this.data=newData;
    }
    get get(){
        return this.data;
    }
}




class Contacts{
    constructor(){
       
        this.data=[];
        // this.data=[new User({
        //     id: `1`,
        //     name: 'Владислав',
        //     email: 'vlad@gmail.com',
        //     addres: 'ул. Ленина, д 9 кв 3',
        //     phone: '+3458595652522'
        // }),new User({
        //     id: `2`,
        //     name: 'Алексей',
        //     email: 'alex@bk.ru',
        //     addres: 'ул. Березина, д 14 кв 12',
        //     phone: '+3458585952522'
        // })];
        
        
    }
    add({name,email,addres,phone}){
       
        let newUser=new User({
            id: `${Math.round(performance.now())}`,
            name: name,
            email: email,
            addres: addres,
            phone: phone
        });
        this.data.push(newUser);
        console.log('информация добавлена'); 
        
        
    }
    edit(id,newObj){
    //    let choosenObj=this.data.find((elem)=>{
    //      if(elem.get.id===id){
    //         return elem;
    //      }
        
    //    });
    //    choosenObj.edit(newObj);
        this.data=this.data.map((elem)=>{
            const contactId=elem.get.id;
            const oldObj=elem.get;
            if(contactId===id){
                elem.edit({
                    ...oldObj,
                    ...newObj
                })
            }
            return elem;
        });
        
    }
    remove(id){
        console.log(this.data);
        this.data=this.data.filter((elem)=>{
            return elem.get.id!==id;
        });
    }
    get get(){
        return this.data;
    }
}



class ContactsApp extends Contacts{
    
    constructor(){
        super();
        this.init();
        
    }
    getCookie(name) {
        var matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
      }
    checkCookie(){
        
        if(this.getCookie('storageExpiration')===undefined){
            localStorage.clear();
        }
        
    }
    init(){
        this.checkCookie();
        this.data=this.storage || [];
        
       
        let site=document.querySelector('.site');
        let container=document.createElement('div');
        container.classList.add('container');
        container.innerHTML=` <div class="container">
                                <div class='main_wrapper'>
                                    <div class="header">
                                        <h2 class="header_title">Контактная книга</h2>
                                    </div>
                                    <div class="main">
                                        <button class="add_btn">
                                            Добавить
                                        </button>
                                        <ul class="contact_book_items">
                                        </ul>
                                        
                                    </div>
                                </div>
    
                            </div>`;
    site.appendChild(container);
    this.addEventListenerBtnAdd();
    this.show();
    
    }
    findInput(){
        let nameInput=document.querySelector('.name_input');
        
        let emailInput=document.querySelector('.email_input');
        let addresInput=document.querySelector('.addres_input');
        let phoneInput=document.querySelector('.phone_input');
        return [nameInput,emailInput,addresInput,phoneInput];
    }
    Verification=(value)=>{
        let regExp=/[\[\]\{\}\|\&]/g;
        
        switch(true){
            case(value.length===0 || value.length===''):
                alert('Одна из строк пуста.Повторите попытку.');
                return false;
            case(value.length<3):
                alert('Длина текста не должна быть меньше 3 символов.Повторите попытку.');
                return false;
            case(value.length>50):
                alert('Длина текста не должна быть больше 50 символов.Повторите попытку.');
                return false;
            case(regExp.test(value)):
                alert('Используются недопустимые символы.Повторите попытку.');
                return false;
            default: return true;

        }
    }
    VerificationPhone(value){
        let regExp=/^\+?(?:00)?\d{12}(?:#\d{2,5})?$/g;
        if(this.Verification(value)){
            if(!regExp.test(value)){
                alert('Телефон не удовлетворяет стандартам.');
                return false;
            }else{
                return true;
            }
        }
        
    }
    VerificationEmail(value){
        let regExp=/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/g;
        if(this.Verification(value)){
            if(!regExp.test(value)){
                alert('Email не удовлетворяет стандартам.Пример: nick@mail.com');
                return false;
            }else{
                return true;
            }
        }
    }
    calcTime(date) {
        let newDate=new Date(date.getTime()+(3600000)*3);
        return newDate;
    }
    workWithCookies(){
        let oldDate=new Date(Date.now());
         let date=this.calcTime(oldDate);
        console.log('this'+date.getTimezoneOffset());
        document.cookie='storageExpiration='+date.toUTCString()+';max-age=864000';
    }
    show(){
       
        const ul=document.querySelector('.contact_book_items');
        let li='';
        let list=this.get;
        list.forEach((elem)=>{
            let {id,name,email,addres,phone}=elem.get;
          
            li+=` <li class="contact_book_item" id='${id}'>
                        <p class="contacts_info">
                            Имя: ${name}<br>
                            Email: ${email}<br>
                            Адрес: ${addres}<br>
                            Телефон: ${phone}<br>
                        </p>
                        <button class="btn edit_btn" data-edit="${id}">Редактировать</button>
                        <button class="btn del_btn" data-del="${id}">Удалить</button>
                    </li>`
        });
        ul.innerHTML=li;
       
        //this.addClickEvent();
        this.addEventListenerBtnEdit();
        this.addEventListenerBtnDel();
       
    }
    addEventListenerBtnAdd(){
        let btn_add=document.querySelector('.add_btn');

        btn_add.addEventListener('click',()=>{
            let modalWindow=this.openAddEditModal(1); 
            this.onAdd(modalWindow);
        });
        
    }
    openAddEditModal(mode,id){
        let info='';
        let isEdit=mode===2;
        if(id!==undefined){
            info=this.data.find((elem)=>{
                if(elem.get.id===id){
                    return elem;
                }
            });
            info=info.get;
        }

        
       
        const modal=document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML=`
                        <div class="modal_container">
                            <div class="main_field">
                                <h2 class='main_field_title'>${isEdit ? `Введите измененные данные` : 'Введите данные для добавления'}</h2>
                                <div class="main_field_info">
                                    <label class="info_label">Имя:</label>
                                    <input class='name_input' type='text' ${isEdit ? `value="${info.name}"` : ""}>
                                    <label class="info_label">Email:</label>
                                    <input class='email_input' type="email" ${isEdit ? `value="${info.email}"` : "" }>
                                    <label class="info_label">Адрес:</label>
                                    <input class='addres_input' type='text' ${isEdit ? `value="${info.addres}"` : "" }>
                                    <label class="info_label">Телефон:</label>
                                    <input class='phone_input' type='tel' ${isEdit ? `value="${info.phone}"` : "" }>
                                    <div class="buttons">
                                        ${!isEdit ? ` <button class="add_btn_modal">Добавить</button>` : ` <button class="edit_btn_modal">Изменить</button>`}
                                    </div>
                                </div>
                            </div>
                        `;
        document.body.appendChild(modal);

        modal.addEventListener('mousedown',(event)=>{
            if(event.target.classList[0]==='modal_container'){
                modal.remove();
            }
        })
        return modal;
       
       
    }
    onAdd(modalWindow){
        const addBtn=modalWindow.querySelector('.add_btn_modal');
        
        addBtn.addEventListener('click',()=>{
            
                    let inputs=this.findInput();
                    let name=inputs[0].value;
                    let email=inputs[1].value;
                    let addres=inputs[2].value;
                    let phone=inputs[3].value;
                    if(this.Verification(name) && this.VerificationEmail(email) && this.Verification(addres) &&  this.VerificationPhone(phone)){
                        this.add({name,email,addres,phone}); 
                        this.storage=this.data;
                        
                        this.show();
                        modalWindow.remove();
                    }
                   
                    
            
        });
    }
    addEventListenerBtnEdit(){
        const edit_buttons=document.querySelectorAll('.edit_btn');
        edit_buttons.forEach((elem)=>{
            elem.addEventListener('click',(event)=>{
                let chooseId=event.target.dataset.edit;
                let modalWindow=this.openAddEditModal(2,chooseId); 
                this.onEdit(chooseId,modalWindow);
            })
        });
    }
    onEdit(id,modalWindow){
        const editdBtn=modalWindow.querySelector('.edit_btn_modal');
        
        editdBtn.addEventListener('click',()=>{
            
                    let inputs=this.findInput();
                    let name=inputs[0].value;
                    let email=inputs[1].value;
                    let addres=inputs[2].value;
                    let phone=inputs[3].value;
                    if(this.Verification(name) && this.VerificationEmail(email) && this.Verification(addres) && this.VerificationPhone(phone)){
                        this.edit(id,{id,name,email,addres,phone}); 
                        this.storage=this.data;
                        this.show();
                        modalWindow.remove();
                    }
                   
            
        });
    }
    addEventListenerBtnDel(){
        const del_buttons=document.querySelectorAll('.del_btn');
        del_buttons.forEach((elem)=>{
            elem.addEventListener('click',(event)=>{
                let chooseId=event.target.dataset.del;
                this.onRemove(chooseId);
            })
        })
    }
    onRemove(id){
        this.remove(id);
        this.storage=this.data;
       
        this.show();
    }

    get storage(){
        let localStorageData=localStorage.getItem('localStorageData');
       
        let testArray=[];
        if(localStorageData!==null){
            
            testArray=JSON.parse(localStorageData);
            testArray=testArray.map((elem)=>{
                let data=elem.data;
                
                elem=new User(data);
                return elem;
            })
          
            
        }else{
            return false;
        }
        return testArray;
    }
    set storage(newData){
        let jsonNewData=JSON.stringify(newData);
        localStorage.setItem('localStorageData',jsonNewData);
        this.workWithCookies();
    }
}


let contactsApp=new ContactsApp();