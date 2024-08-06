interface LimiterProps {
    value: number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Limiter: React.FC<LimiterProps> = ({ value, onChange }) => {
    return (
        <select 
            name="limiter" 
            className="border-gray-200 border px-5 text-center mx-auto py-3 rounded-lg"
            value={value}
            onChange={onChange}
        >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
        </select>
    )
}