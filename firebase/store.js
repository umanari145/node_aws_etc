var admin = require("firebase-admin");
var serviceAccount = require("./firebase_key.json");
var loadenv = require('node-env-file')
loadenv('.env')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});
/*
var setUsers = admin.firestore().collection('users');

setUsers.doc('class1').set({
    'id': 1,
    'user':'tarou'
});
*/

var prefecturesRef = admin.firestore().collection('prefectures');

/* 追加するデータカラム
.doc() → id自動割り当て
.doc('id独自定義') → id独自定義

prefecturesRef.doc().set({ name: '北海道', en: 'Hokkaido'});
prefecturesRef.doc().set({ name: '青森県', en: 'Aomori'});
prefecturesRef.doc().set({ name: '岩手県', en: 'Iwate'});
prefecturesRef.doc().set({ name: '宮城県', en: 'Miyagi'});
prefecturesRef.doc().set({ name: '秋田県', en: 'Akita'});
prefecturesRef.doc().set({ name: '福島県', en: 'Fukushima'});
prefecturesRef.doc().set({ name: '茨城県', en: 'Ibaraki'});
prefecturesRef.doc().set({ name: '栃木県', en: 'Tochigi'});
prefecturesRef.doc().set({ name: '群馬県', en: 'Gunma'});
prefecturesRef.doc().set({ name: '埼玉県', en: 'Saitama'});
prefecturesRef.doc().set({ name: '千葉県', en: 'Chiba'});
prefecturesRef.doc().set({ name: '東京都', en: 'Tokyo'});
prefecturesRef.doc().set({ name: '神奈川県', en: 'Kanagawa'});
prefecturesRef.doc().set({ name: '富山県', en: 'Toyama'});
prefecturesRef.doc().set({ name: '石川県', en: 'Ishikawa'});
prefecturesRef.doc().set({ name: '福井県', en: 'Fukui'});
prefecturesRef.doc().set({ name: '山梨県', en: 'Yamanashi'});
prefecturesRef.doc().set({ name: '福井県', en: 'Fukui'});
prefecturesRef.doc().set({ name: '長野県', en: 'Nagano'});
prefecturesRef.doc().set({ name: '岐阜県', en: 'Gifu'});
prefecturesRef.doc().set({ name: '静岡県', en: 'Shizuoka'});
prefecturesRef.doc().set({ name: '愛知県', en: 'Aichi'});
prefecturesRef.doc().set({ name: '三重県', en: 'Mie'});
prefecturesRef.doc().set({ name: '滋賀県', en: 'Shiga'});
prefecturesRef.doc().set({ name: '京都府', en: 'Kyoto'});
prefecturesRef.doc().set({ name: '大阪府', en: 'Osaka'});
prefecturesRef.doc().set({ name: '兵庫県', en: 'Hyogo'});
prefecturesRef.doc().set({ name: '奈良県', en: 'Nara'});
prefecturesRef.doc().set({ name: '和歌山県', en: 'Wakayama'});
prefecturesRef.doc().set({ name: '鳥取県', en: 'Tottori'});
prefecturesRef.doc().set({ name: '島根県', en: 'Shimane'});
prefecturesRef.doc().set({ name: '岡山県', en: 'Okayama'});
prefecturesRef.doc().set({ name: '広島県', en: 'Hiroshima'});
prefecturesRef.doc().set({ name: '山口県', en: 'Yamaguchi'});
prefecturesRef.doc().set({ name: '徳島県', en: 'Tokushima'});
prefecturesRef.doc().set({ name: '香川県', en: 'Kagawa'});
prefecturesRef.doc().set({ name: '愛媛県', en: 'Ehime'});
prefecturesRef.doc().set({ name: '高知県', en: 'Kochi'});
prefecturesRef.doc().set({ name: '福岡県', en: 'Fukuoka'});
prefecturesRef.doc().set({ name: '佐賀県', en: 'Saga'});
prefecturesRef.doc().set({ name: '長崎県', en: 'Nagasaki'});
prefecturesRef.doc().set({ name: '熊本県', en: 'Kumamoto'});
prefecturesRef.doc().set({ name: '大分県', en: 'Oita'});
prefecturesRef.doc().set({ name: '宮崎県', en: 'Miyazaki'});
prefecturesRef.doc().set({ name: '鹿児島県', en: 'Kagoshima'});
prefecturesRef.doc().set({ name: '沖縄県', en: 'Okinawa'});
*/
*
var Users = admin.firestore().collection('prefectures').get();
Users.then((list_data) => {
    list_data.forEach((doc) => {
        console.log(doc.data())
    })
})
