// Initialize Firebase
  var config = {
    apiKey: "AIzaSyC57tVt-cUjcQdNGQueq26DBO1jod6sg_0",
    authDomain: "ece453smartstation.firebaseapp.com",
    databaseURL: "https://ece453smartstation.firebaseio.com",
    projectId: "ece453smartstation",
    storageBucket: "",
    messagingSenderId: "272582667547"
  };
  firebase.initializeApp(config);

  //Access the database
  var db = firebase.database();
  var sessionsRef = db.ref("sessions");

  //Detect when we receive values for the form filled out by the user
  sessionsRef.on('value', function(snapshot){
        vueRoot.sessions = snapshot.val();
  });

  //Create a Vue instance and store the different fields entered in teh form
  var vueRoot = new Vue({
    el: "#root",
	
	firebase: {
		sessions: sessionsRef
	},
	
    data:{
        //Declaration and initilization of fields associated with each work session
        newSession:{
            username: '',
            sessionName: '',
            sessionDate: '',
            startTime: '',
            endTime: '',
            goals: '',
            priorityRank: []
        }, 
        //Declration and initilization of array that stores all the sessions on workstation
        sessions: []
    },
    //Adding data to database
    methods:{
        addNewSession: function(){
            //Add new session entry into database
            var newSessionRef = sessionsRef.push();
            newSessionRef.set(this.newSession);
            this.newSession = {
                username: '',
                sessionName: '',
                sessionDate: '',
                startTime: '',
                endTime: '',
                goals: '',
                priorityRank: []               
            }
        }
    }
  });