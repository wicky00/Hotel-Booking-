import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { storage } from "../../firebase";
import Progress from "./Progress";
import './styles.css'


const formValid = formErrors => {
    let valid = true;
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });
    return valid;
};

export default class AddRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomNo: "",
            type: "",
            noOfBeds: Number,
            price: Number,
            description: "",
            availability: "",
           
            //Firebase Image Upload States
            file: null,
            uploadPercentage: 0,
            NoItemImg:"https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",
            // NoItemImg: defaultImage,
            image: "",

            formErrors: {
                roomNo: "",
                type: "",
                noOfBeds: "",
                price: "",
                description: "",
                availability: ""

            }

        }
    }

    uploadImage(e) {
        if (e.target.files[0] !== null) {
            const uploadTask = storage
                .ref(`room/${e.target.files[0].name}`)
                .put(e.target.files[0]);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    //progress function
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    this.setState({ uploadPercentage: progress });
                },
                (error) => {
                    //error function
                    console.log(error);
                },
                () => {
                    //complete function
                    storage
                        .ref("room")
                        .child(e.target.files[0].name)
                        .getDownloadURL()
                        .then((url) => {
                            console.log(url);
                            this.setState({ image: url });
                        });
                }
            );
        } else {
            alert("Error Upload Image First")
        }
    }


//validations
    handleInputChange = (e) => {
        // validaons
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;
        switch (name) {
            case "roomNo":
                    formErrors.roomNo =
                        value.length < 5 || value.length > 7
                            ? "Room number should be charactors between 5 to 7"
                            : "";
            break;
            case "type":
                formErrors.type =
                    value.length < 5
                        ? "Minimum charchter must be 5"
                        : "";
                break;
            case "noOfBeds":
                formErrors.noOfBeds =
                    value < 0
                        ? "Your are entering negative value !"
                        : "";
                break;
                case "price":
                    formErrors.price =
                        value < 0
                            ? "Your are entering negative value !"
                            : "";
                    break;
            
            default:
                break;
        }
        this.setState({ formErrors, [name]: value }, () => console.log(this.state));

        this.setState({
            ...this.state,
            [name]: value
        });
    };

    onSubmit = (e) => {
        e.preventDefault();

        if (formValid(this.state.formErrors)) {


            const { roomNo, type, noOfBeds, price, description, availability, image } = this.state;

            const data = {
                roomNo: roomNo,
                type: type,
                noOfBeds: noOfBeds,
                price: price,
                description: description,
                availability: availability,
                image: image,

            }
            console.log(data)
            axios.post("http://localhost:8000/room/add", data).then((res) => {
                if (res.data.success) {
                    toast(`New Room Added`, {
                        type: toast.TYPE.SUCCESS,
                        autoClose: 4000
                    });
                    this.setState(
                        {
                            roomNo: "",
                            type: "",
                            noOfBeds: Number,
                            price: Number,
                            description: "",
                            availability: "",
                           

                        }
                    )
                };
            });
        }
    else {
            toast(`😀 Plaese fill out the field. `, {
                type: toast.TYPE.ERROR,
                autoClose: 4000
            });

        }
    };

    render() {
        const { formErrors } = this.state;

        return (
            <div className="container containerTop">
                <div className="row ">
                   
                    <div className="col-12">
                        <div className="row">
                            <div className="col position-relative link">
                                <p><a href="/Room_Home">Room Management</a> {'>'} Add a new room</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-9 position-relative">
                                <h2>Add New Room</h2>

                            </div>
                            <hr className="hr" style={{ height: '2px', color: '#0a90e8' }} />
                        </div>
                        <div className="shadowBoxForm">
                            <form onSubmit={this.onSubmit}>
                                <div className="row">
                                    <div className="col-6 form">
                                        <div className="form-row">
                                            {/* Room No */}
                                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                                <label style={{ marginBottom: '5px' }}>Room No:</label>
                                                <input type="text"
                                                    className="form-control"
                                                    name="roomNo"
                                                    minLength="4"
                                                    maxLength="7"
                                                    placeholder="Enter Room No"
                                                    value={this.state.roomNo}
                                                    onChange={this.handleInputChange} required
                                                    
                                                    />
                                    {formErrors.roomNo.length < 5 || formErrors.roomNo.length > 7 && (
                                    <span style={{ color: 'red' }} className="errorMessage">{formErrors.roomNo}</span>
                                )}
                                   
                                                  
                                            </div>
                                            {/* Room Type */}
                                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                                <label style={{ marginBottom: '5px' }}>Room Type</label>
                                                <select id="Room Type" className="form-control" name="type" onChange={this.handleInputChange} value={this.state.type} required>
                                                    <option selected>Choose Room Type</option>
                                                    <option value="Single Economy ">Single Economy </option>
                                                    <option value="Single Basic">Single Basic</option>
                                                    <option value="Single Standard ">Single Standard </option>

                                                    <option value="Single Deluxe ">Single Deluxe </option>
                                                    <option value="Double Economy ">Double Economy </option>
                                                    <option value="Double Basic ">Double Basic </option>

                                                    <option value="Double Standard ">Double Standard </option>
                                                    <option value="Double Deluxe ">Double Deluxe </option>
                                                    <option value="Family Economy ">Family Economy </option>

                                                    <option value="Family Basic">Family Basic </option>
                                                    <option value="Family Standard ">Family Standard </option>
                                                    <option value="Family Deluxe">Family Deluxe</option>
                                                </select>
                                            </div>

                                            {/* noOfBeds */}

                                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                                <label style={{ marginBottom: '5px' }}>Number Of Beds</label>
                                                <input type="number"
                                                    className="form-control"
                                                    name="noOfBeds"
                                                    placeholder="Enter Number of Beds"
                                                    value={this.state.noOfBeds}
                                                    onChange={this.handleInputChange} />
                                                {formErrors.noOfBeds < 0 || (
                                                    <span style={{ color: 'red' }} className="errorMessage">{formErrors.noOfBeds}</span>
                                                )}
                                            </div>

                                            {/* price */}
                                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                                <label style={{ marginBottom: '5px' }}>Price</label>
                                                <input type="number"
                                                    className={"form-control"}
                                                    name="price"
                                                    placeholder="Enter price"
                                                    value={this.state.price}
                                                    onChange={this.handleInputChange} />
                                                {formErrors.price < 0 || (
                                                    <span style={{ color: 'red' }} className="errorMessage">{formErrors.price}</span>
                                                )}                                               
                                            </div>

                                            {/* Description */}
                                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                                <label style={{ marginBottom: '5px' }}>Description</label>
                                                <input type="text"
                                                    className="form-control"
                                                    name="description"
                                                    placeholder="Enter Description"
                                                    value={this.state.description}
                                                    onChange={this.handleInputChange} />

            

                                            </div>

                        
                                            {/* availability */}
                                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                                <label style={{ marginBottom: '5px' }}>Availability</label>
                                                <select id="availability" className="form-control" name="availability" onChange={this.handleInputChange} value={this.state.availability} required>
                                                    <option selected>Choose Availability</option>
                                                    <option value="Available">Available</option>
                                                    <option value="Unavailable">Unavailable</option>
                                                </select>

                        
                                            </div>



                                            <div style={{marginTop:'75px'}}>
                                                <button href="/guide_add" type="submit" className="btn btn-danger Rsub_btn2"><i class="far fa-times-circle"></i>&nbsp;Reset</button>
                                                <button type="submit" className="btn btn-primary Rsub_btn" onClick={this.onSubmit}><i class="far fa-save"></i>&nbsp;Add</button>

                                            </div>

                                        </div>

                                    </div>


                                    {/* add image */}
                                    <div className="col-6 guideImage">

                                        {this.state.image ? (
                                            <img
                                                src={this.state.image}
                                                alt="productImg"
                                                style={{ width: "400px", marginLeft: "62px", display: "flex", flexDirection: "column" }}
                                            />
                                        ) : (
                                            <img
                                                src={this.state.NoItemImg}
                                                alt="productImg"
                                                style={{ width: "400px", marginLeft: "62px", display: "flex", flexDirection: "column" }}
                                            />
                                        )}
                                        <div className="row">
                                            <div className="form-group" style={{ width: "500px", marginTop: "40px", marginLeft: "10px" }}>
                                                <Progress percentage={this.state.uploadPercentage} />
                                            </div>
                                        </div>
                                        <div className="row" style={{ marginTop: '50px', maxWidth: '525px' }}>
                                            <div class="input-group mb-3">
                                                <input type="file" class="form-control" id="inputGroupFile02" name="ImgLink" style={{ borderRadius: '20px' }}
                                                    onChange={(e) => { this.setState({ file: e.target.files[0] }); this.uploadImage(e); }} />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>





                </div>
            </div>

        );
    };
};