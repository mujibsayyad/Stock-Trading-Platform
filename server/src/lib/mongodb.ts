import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    await connect(process.env.DB as string);
    console.log('Connected to DB');
  } catch (error) {
    console.error('Failed to connect to the database', error);
  }
};

export default connectDB;
