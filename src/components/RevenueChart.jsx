import { Bar } from "react-chartjs-2";

export default function RevenueChart(){

const data = {
labels:["Jan","Feb","Mar","Apr"],
datasets:[
{
label:"Revenue",
data:[2000,3500,4000,5000],
backgroundColor:"blue"
}
]
};

return <Bar data={data} />;
}