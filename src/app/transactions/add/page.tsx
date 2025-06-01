import AddTransactionForm from "./add-transaction-form"

export default function AddTransactionPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6 space-y-6">
            {/* Clean Header */}
            <div className="bg-white border-3 border-slate-700 rounded-lg p-6 shadow-[4px_4px_0px_0px_#475569]">
                <h1 className="text-2xl md:text-3xl font-black text-slate-800">Add Transaction</h1>
                <p className="text-slate-600 font-medium mt-2">Record your financial activity</p>
            </div>

            {/* Form Container */}
            <div className="max-w-2xl mx-auto">
                <div className="bg-white border-3 border-slate-700 rounded-lg shadow-[4px_4px_0px_0px_#475569] p-6 md:p-8">
                    <AddTransactionForm />
                </div>
            </div>
        </div>
    )
}