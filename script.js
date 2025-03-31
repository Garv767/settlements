document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 Script loaded!");

    // ✅ Firebase Configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCDkpcp0MHie6TIrFyEzKWgC6EEd8WXg0o",
        authDomain: "settlements-d5a44.firebaseapp.com",
        projectId: "settlements-d5a44",
        storageBucket: "settlements-d5a44.firebasestorage.app",
        messagingSenderId: "1048204023857",
        appId: "1:1048204023857:web:59cd55a832d051bae5dd10",
        measurementId: "G-3VFBKMRWP7"
    };

    // ✅ Ensure Firebase is loaded before initializing
    if (typeof firebase !== "undefined") {
        console.log("✅ Firebase Loaded Successfully!");
        firebase.initializeApp(firebaseConfig);
    } else {
        console.error("❌ Firebase not loaded!");
        return;
    }

    const auth = firebase.auth();

    // ✅ Google Login
    document.getElementById("googleLogin").addEventListener("click", () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(result => {
                const user = result.user;
                document.getElementById("userInfo").textContent = `Welcome, ${user.displayName}`;
                document.getElementById("googleLogin").style.display = "none";
                document.getElementById("logoutBtn").style.display = "block";
            })
            .catch(error => console.error("❌ Login Error:", error));
    });

    // ✅ Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
        auth.signOut().then(() => {
            document.getElementById("userInfo").textContent = "";
            document.getElementById("googleLogin").style.display = "block";
            document.getElementById("logoutBtn").style.display = "none";
        });
    });

    // ✅ Bill Splitting Logic
    document.getElementById("splitType").addEventListener("change", function () {
        let splitType = this.value;
        let customInputs = document.getElementById("customInputs");
        customInputs.innerHTML = ""; // Clear previous inputs

        if (splitType !== "equal") {
            let numPeople = parseInt(document.getElementById("numPeople").value);
            if (isNaN(numPeople) || numPeople <= 0) {
                alert("⚠️ Please enter a valid number of people first.");
                return;
            }

            for (let i = 1; i <= numPeople; i++) {
                let div = document.createElement("div");
                div.className = "person-input";
                div.innerHTML = `
                    <label>Person ${i}:</label>
                    <input type="number" id="person${i}" placeholder="${splitType === 'custom' ? 'Enter amount (₹)' : 'Enter %'}">
                `;
                customInputs.appendChild(div);
            }
        }
    });

    // ✅ Calculate Split
    document.getElementById("calculateBtn").addEventListener("click", function () {
        let totalAmount = parseFloat(document.getElementById("totalAmount").value);
        let splitType = document.getElementById("splitType").value;
        let resultDiv = document.getElementById("result");

        if (isNaN(totalAmount) || totalAmount <= 0) {
            alert("⚠️ Please enter a valid total amount.");
            return;
        }

        resultDiv.innerHTML = ""; // Clear previous results

        if (splitType === "equal") {
            let numPeople = parseInt(document.getElementById("numPeople").value);
            if (isNaN(numPeople) || numPeople <= 0) {
                alert("⚠️ Please enter a valid number of people.");
                return;
            }
            let amountPerPerson = (totalAmount / numPeople).toFixed(2);
            resultDiv.innerHTML = `<p>Each person pays: ₹${amountPerPerson}</p>`;
        } 
        else if (splitType === "custom") {
            let numPeople = document.getElementById("customInputs").children.length;
            let totalCustomAmount = 0;
            let personPayments = [];

            for (let i = 1; i <= numPeople; i++) {
                let amount = parseFloat(document.getElementById(`person${i}`).value);
                if (isNaN(amount) || amount <= 0) {
                    alert(`⚠️ Enter a valid amount for Person ${i}`);
                    return;
                }
                totalCustomAmount += amount;
                personPayments.push(`Person ${i} pays: ₹${amount.toFixed(2)}`);
            }

            if (totalCustomAmount !== totalAmount) {
                alert("⚠️ Total entered amounts do not match the bill!");
                return;
            }

            resultDiv.innerHTML = personPayments.join("<br>");
        } 
        else if (splitType === "percentage") {
            let numPeople = document.getElementById("customInputs").children.length;
            let totalPercentage = 0;
            let personPayments = [];

            for (let i = 1; i <= numPeople; i++) {
                let percent = parseFloat(document.getElementById(`person${i}`).value);
                if (isNaN(percent) || percent <= 0) {
                    alert(`⚠️ Enter a valid percentage for Person ${i}`);
                    return;
                }
                totalPercentage += percent;
                let amount = (totalAmount * percent / 100).toFixed(2);
                personPayments.push(`Person ${i} pays: ₹${amount}`);
            }

            if (totalPercentage !== 100) {
                alert("⚠️ Total percentage must be exactly 100%!");
                return;
            }

            resultDiv.innerHTML = personPayments.join("<br>");
        }
    });

    // ✅ Reset Form
    document.getElementById("resetBtn").addEventListener("click", function () {
        document.getElementById("totalAmount").value = "";
        document.getElementById("numPeople").value = "";
        document.getElementById("customInputs").innerHTML = "";
        document.getElementById("result").innerHTML = "";
    });

    // ✅ Add Group Member
    document.getElementById("addMemberBtn").addEventListener("click", function () {
        let memberName = document.getElementById("memberName").value;
        if (memberName.trim() === "") {
            alert("⚠️ Please enter a valid name.");
            return;
        }

        let li = document.createElement("li");
        li.textContent = memberName;
        document.getElementById("groupMembers").appendChild(li);

        document.getElementById("memberName").value = ""; // Clear input
    });
});
