const bcrypt = require("bcryptjs");
const users = require("../Modal/userModel");
const jwt = require("jsonwebtoken");

exports.userRegisterController = async (req, res) => {
    console.log("Inside the user register controller");

    const { username, email, password, roll, aadhar, mobileno, location, status, experience, skills } = req.body;

    try {
        // Check if user already exists
        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const Lowercasemail = email.toLowerCase()


        let newUserData = {
            username,
            email: Lowercasemail,
            password: hashedPassword,
            roll,
            gender: "",
            dob: "",
            profilepic: "",
        };

        if (roll === "worker") {
            // Validate required worker fields
            if (!aadhar || !mobileno || !location || !status || !skills) {
                return res.status(400).json({ success: false, message: "All worker fields are required" });
            }
            const Lowercaseloca = location.toLowerCase()
            // Add worker-specific fields
            newUserData = {
                ...newUserData,
                aadhar,
                mobileno,
                location: Lowercaseloca,
                status,
                experience: "",
                skills,
            };
        }

        // Save user to the database
        const newUser = new users(newUserData);
        await newUser.save();
        const token = jwt.sign({ userid: newUser._id, roll: newUser.roll }, process.env.jwt_pass)
        res.status(201).json({ user: newUser, token: token });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.userLoginController = async (req, res) => {
    console.log("inside the login controller");

    const { email, password } = req.body

    const lowercase = email.toLowerCase()
    try {
        const existingUser = await users.findOne({ email: lowercase })

        console.log(existingUser);

        if (existingUser) {

            if (existingUser.block == false) {
                const ispasswordMatch = await bcrypt.compare(password, existingUser.password)
                console.log(ispasswordMatch);

                if (ispasswordMatch || password == existingUser.password) {
                    console.log(ispasswordMatch);

                    const token = jwt.sign({ userid: existingUser._id, roll: existingUser.roll }, process.env.jwt_pass,{expiresIn:'2m'})

                    console.log(token, "token");
                    res.status(200).json({ user: existingUser, token })

                }
                else {
                    res.status(409).json("invalid password or email")
                }
            }
            else {
                res.status(409).json("temporary blocked please try agin later..!")
            }

        }
        else {
            res.status(409).json("invalid email please signup")
        }

    } catch (error) {
        res.status(401).json(error)
    }
}

exports.getAllusersController = async (req, res) => {
    console.log("Inside the getusercontrol");


    try {
        const allusers = await users.find({ roll: "user", block: false })
        res.status(201).json(allusers);
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.getSingleUserController = async (req, res) => {
    console.log("inside the getsingle user controller");

    const userid = req.userid

    try {

        const singleuser = await users.findById({ _id: userid })
        res.status(200).json(singleuser)

    } catch (error) {
        res.status(401).json(error)
    }
}

exports.getAllworkersController = async (req, res) => {
    console.log("Inside the getusercontroller");


    try {
        const allworkers = await users.find({ roll: "worker", block: false })

        res.status(201).json(allworkers);
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.deleteuserController = async (req, res) => {
    console.log("Inside the delete controller");

    const { id } = req.params

    try {
        const deleteuser = await users.findByIdAndDelete({ _id: id })
        res.status(201).json(deleteuser);
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.changePasswordController = async (req, res) => {

    console.log("inside the change password controller");

    const { currentPass, newPass, email } = req.body
    const userid = req.userid

    try {
        const exsistinguser = await users.findOne({ email })

        if (exsistinguser) {
            console.log(exsistinguser);

            const ispasswordMatch = await bcrypt.compare(currentPass, exsistinguser.password)

            if (ispasswordMatch) {
                console.log(ispasswordMatch, "indrdf");


                const salt = await bcrypt.genSalt(10);
                const hashpass = await bcrypt.hash(newPass, salt);

                console.log(hashpass, "hhh");


                const updatepass = await users.findByIdAndUpdate(
                    userid,
                    { password: hashpass },
                    { new: true }
                );
                await updatepass.save()

                res.status(200).json({ message: "Password changed successfully" });
            }

            else {
                res.status(401).json("current passowrd is not match")
            }
        }
        else {
            res.status(401).json("please login")
        }


    } catch (error) {

    }
}

exports.searchUserController = async (req, res) => {
    console.log("Inside the filterUserController");

    const { search } = req.query;

    const lowercasesearch = search.toLowerCase()
    try {
        let query = { status: "available", roll: "worker" };

        if (search) {

            query["$or"] = [
                { username: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { skills: { $regex: search, $options: "i" } }
            ];
        }

        let unavailableQuery = { status: "unavailable", roll: "worker" };
        if (search) {


            unavailableQuery["$or"] = [
                { username: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },

                { skills: { $regex: search, $options: "i" } }
            ];
        }

        // FIXED: Removed `{ query }` and `{ unavailableQuery }`, passing the object directly.
        const filteredAvailableUsers = await users.find(query);
        const filteredUnavailableUsers = await users.find(unavailableQuery);

        console.log(filteredAvailableUsers, filteredUnavailableUsers);

        res.status(200).json({
            filteredAvailableUsers,
            filteredUnavailableUsers
        });
    } catch (error) {
        console.error("Error in filterUserController:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.updateProfileController = async (req, res) => {
    console.log("inside the updateProfileController");

    try {
        const { skills, experience, status, location, mobileno, gender, dob, username, profilepic } = req.body
        const uploadimg = req.file ? req.file.filename : profilepic
        const userid = req.userid

        let parsedSkills = [];

        // Handle skills as array or stringified array
        if (typeof skills === "string") {
            try {
                parsedSkills = JSON.parse(skills);
            } catch {
                parsedSkills = [skills]; // fallback in case it's a single skill
            }
        } else if (Array.isArray(skills)) {
            parsedSkills = skills;
        }

        const exsistinguser = await users.findById({ _id: req.userid })

        if (exsistinguser.roll === "worker")
            if (parsedSkills.length === 0 || !username || !mobileno || !location || !status) {
                return res.status(401).json({message:"Please complete the form"})
            }
        else if (!username) {
                return res.status(401).json({message:"Username is required"})
            }
        

        const updateprofile = await users.findByIdAndUpdate({ _id: userid }, { username, mobileno, dob, gender, location, skills: parsedSkills, status, experience, profilepic: uploadimg }, { new: true })
        console.log(updateprofile);

        await updateprofile.save()
        res.status(200).json({ message: "successfully updated", data: updateprofile })

    } catch (error) {
        res.status(401).json(error)
    }

}

exports.deleteAccountController = async (req, res) => {
    console.log("deleteAccountController");

    const { email, password } = req.body
    const userid = req.userid

    try {

        const exsistinguser = await users.findOne({ email })
        const curentuser = await users.findById({ _id: userid })

        if (exsistinguser) {

            if (exsistinguser.email === curentuser.email) {

                const ispasswordMatch = await bcrypt.compare(password, exsistinguser.password)

                if (ispasswordMatch) {
                    console.log(ispasswordMatch, "hellooo");
                    const deleteuser = await users.findByIdAndDelete({ _id: userid })
                    res.status(200).json(deleteuser);
                }
                else {
                    res.status(401).json("invalid email or password")
                }
            }
            else {
                res.status(401).json("invalid email or password")
            }

        }
        else {
            res.status(401).json("invalid email or password")
        }


    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//block

exports.updateBlockController = async (req, res) => {
    console.log("inside the updateblock controller");

    const { id } = req.params
    const { block } = req.body

    try {
        const user = await users.findById({ _id: id })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.block == block) {

            const unblockeduser = await users.findByIdAndUpdate({ _id: id }, { block }, { new: true })
            await unblockeduser.save()
            console.log(unblockeduser, "unblockeduser")
            res.status(200).json({ message: "unblocked user", data: unblockeduser })
        }
        else {
            const blockeduser = await users.findByIdAndUpdate({ _id: id }, { block }, { new: true })
            await blockeduser.save()
            console.log(blockeduser, "blockeduser");

            res.status(200).json({ message: "blocked user", data: blockeduser })
        }

    } catch (error) {
        res.status(401).json(error)
    }

}

exports.getAllblokedusersController = async (req, res) => {
    console.log("inside the blocked user constroller");
    const { roll } = req.body

    try {
        const blockedusers = await users.find({ block: true, roll })
        res.status(200).json(blockedusers)
    } catch (error) {
        res.status(401).json(error)
    }

}




