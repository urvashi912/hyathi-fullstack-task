import  mongoose, { Schema, model } from  "mongoose";

export interface UserDocument {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
    password: string;
    name: string;
    image: string;
    adoptedPokemon:string
    createdAt: Date;
    updatedAt: Date;
    id?: string; 
  }

  const UserSchema = new Schema<UserDocument>({
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: [true, "Name is required"]
    },
    
    adoptedPokemon: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pokemon' }],
   
  },
  {
    timestamps: true,
  }
);

const  User  =  mongoose.models?.User  ||  model<UserDocument>('User', UserSchema);
export  default  User;