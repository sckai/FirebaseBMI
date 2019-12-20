// Initialize Firebase
var config = {
    apiKey: "AIzaSyBjD2SA3JmlyvArAuq3CikCwoP4A-6eOew",
    authDomain: "project-632d1.firebaseapp.com",
    databaseURL: "https://project-632d1.firebaseio.com",
    projectId: "project-632d1",
    storageBucket: "project-632d1.appspot.com",
    messagingSenderId: "280245956231"
};
firebase.initializeApp(config);

let data = {};
let reverseArry = [];

// DOC
const heightDoc = document.querySelector('#height');
const weightDoc = document.querySelector('#weight');
const sendDoc = document.querySelector('#send');
const listDoc = document.querySelector('#list');
let standFontDoc = document.querySelector('.standFont');
let BMI = '';




if(!firebase.database().ref('BMI')){
    firebase.database().ref('BMI').set('BMI');
}
const BMIRef = firebase.database().ref('BMI'); 

window.onload=function(){
    displayData();
}

function BMIStandValue(BMI){
    let BmiColor = '';
    let BmiStr = '';
    if( BMI < 18.5 ){
        BmiColor = '#31BAF9';
        BmiStr = '過輕';
    }else if( BMI >= 18.5 && BMI < 24.9 ){
        BmiColor = '#86D73F';
        BmiStr = '理想';
    }else if( BMI >= 24.9 && BMI < 29.9 ){
        BmiColor = '#FF982D';
        BmiStr = '過重';
    }else if( BMI >= 29.9 && BMI < 34.9 ){
        BmiColor = '#FF6C03';
        BmiStr = '輕度肥胖';
    }else if( BMI >= 34.9 && BMI < 39.9 ){
        BmiColor = '#FF6C03';
        BmiStr = '中度肥胖';
    }else if( BMI >= 39.9 ){
        BmiColor = '#FF1200';
        BmiStr = '重度肥胖';
    }

    return {'BmiColor': BmiColor, 'BmiStr':BmiStr}
}

function pushData(){
    const nowTime = new Date();
    const nowYear = nowTime.getFullYear();
    const nowMonth = nowTime.getMonth() + 1;
    const nowDay = nowTime.getDate();
    BMI = (weightDoc.value / ((heightDoc.value / 100)*(heightDoc.value / 100))).toFixed(2);
 
    const  BMIStand = BMIStandValue(BMI);

    data = {
        height: heightDoc.value,
        weight: weightDoc.value,
        BMI:   BMI,
        BMIstr: BMIStand.BmiStr,
        date: `${nowDay}-${nowMonth}-${nowYear}`,
        BmiColor: BMIStand.BmiColor,
    }
    BMIRef.push(data);
    btnStyle();
    displayData();
}


//顯示資料
function displayData(){
    let str = '';
    BMIRef.once('value', function(e){

        const DataLength = e.numChildren();  //dataBase object length
        let DataE = e.val();
        if( DataLength > 9){
            removeData(DataE);
        }

        e.forEach(function(item) {
            reverseArry.push(item.val());
        });
        reverseArry.reverse();  //翻轉資料放入陣列,再顯示
        for (const item in reverseArry) {
            reverseArry[item].BmiColor;
            str += `<li class="mb-3 d-flex justify-content-around align-items-center">
                        <div class="liStyle" style="background: ${reverseArry[item].BmiColor};"></div>
                        <div>
                            <h4 class="mb-0 ">${reverseArry[item].BMIstr}</h4>
                        </div> 
                        <div class="d-flex">
                            <h6 class="mt-1 mr-1 d-none d-md-block">BMI</h6>
                            <h4 class="mb-0">${reverseArry[item].BMI}</h4>
                        </div>
                        <div class="d-flex">
                            <h6 class="mt-1 mr-1 d-none d-md-block">weight</h6>
                            <h4 class="mb-0">${reverseArry[item].weight}kg</h4>
                        </div>
                        <div class="d-flex">
                            <h6 class="mt-1 mr-1 d-none d-md-block">height</h6>
                            <h4 class="mb-0">${reverseArry[item].height}cm</h4>
                        </div>
                        <div>
                            <h5 class="mb-0 d-none d-md-block">${reverseArry[item].date}</h5>
                        </div>
                    </li>`;
        }
        listDoc.innerHTML = str;
        str = '';
        reverseArry = [];
    })
    
}

function btnStyle(){
    const BtnFontDoc = document.querySelector('#BtnFontColor');
    const BMIFontDoc = document.querySelector('#BMIFontColor');
    const refreshDoc = document.querySelector('.refresh');
    const  BMIStand = BMIStandValue(BMI);
    //看結果字樣
    BtnFontDoc.style.color = BMIStand.BmiColor;

    //BMI字樣
    BMIFontDoc.style.color = BMIStand.BmiColor;
    BMIFontDoc.style.display = 'block';
    
    //重整icon
    refreshDoc.style.display  = 'block';
    refreshDoc.style.background  = BMIStand.BmiColor;

    //send style
    sendDoc.style.background  = '#424242';
    sendDoc.style.border = `6px solid ${BMIStand.BmiColor}`;

    //stand 
    standFontDoc.style.display  = 'block';
    standFontDoc.style.color = BMIStand.BmiColor;
    standFontDoc.textContent = BMIStand.BmiStr;

}

function removeData(DataE){
    for (const key in DataE) {
        BMIRef.child(key).remove();
        break;
    }

}

function checkNum(){
    const regExp = /^[0-9]+(.[0-9]{1,2})?$/;
    return (regExp.test(heightDoc.value)) && (regExp.test(weightDoc.value));
}

sendDoc.addEventListener('click',function(){
    const checkValue = checkNum();
    if( checkValue == true){
        btnStyle();
        pushData();
        displayData();
    }else{
        standFontDoc.style.display = 'block';
        standFontDoc.textContent = '僅能數字(小數2位)';
    }
})



