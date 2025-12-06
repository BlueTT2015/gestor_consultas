import Card from "../Card";
import CardBody from "../CardBody";
import { Calendar, Loader, AlertTriangle } from 'lucide-react';
import { colors } from "../../config/colors";
import PropTypes from 'prop-types';

export function SimpleLoadingState() {
    return (
        <div className="min-h-screen py-10 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
            <div className="flex items-center gap-3 text-lg font-medium" style={{ color: colors.secondary }}>
                <Loader size={24} className="animate-spin" />
                A carregar dados...
            </div>
        </div>
    );
}

export function DetailedLoadingState({ message = "A carregar informações..." }) {
    return (
        <div className="min-h-screen py-10 p-6" style={{ backgroundColor: colors.background }}>
            <Card variant="light" className="max-w-4xl mx-auto h-96">
                <div className="animate-pulse flex flex-col justify-center items-center h-full">
                    <Calendar size={48} className="mb-4" style={{ color: colors.secondary }} />
                    <div className="h-6 rounded mb-2 w-1/3 bg-gray-200"></div>
                    <div className="h-4 rounded w-1/4 bg-gray-200"></div>
                    <p className="mt-4 text-sm text-gray-500">{message}</p>
                </div>
            </Card>
        </div>
    );
}

export function ErrorMessage({ message, onBack, backLabel = "Voltar" }) {
    return (
        <div className="min-h-screen py-10" style={{ backgroundColor: colors.background }}>
            <Card variant="error" className="max-w-md mx-auto my-10">
                <CardBody>
                    <div className="flex items-center gap-3">
                        <AlertTriangle size={24} />
                        <h2 className="text-xl font-bold">Erro</h2>
                    </div>
                    <p className="mt-2">{message}</p>
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="mt-4 px-4 py-2 rounded-lg text-white"
                            style={{ backgroundColor: colors.primary }}
                        >
                            {backLabel}
                        </button>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}

DetailedLoadingState.propTypes = { message: PropTypes.string };
ErrorMessage.propTypes = { message: PropTypes.string.isRequired, onBack: PropTypes.func, backLabel: PropTypes.string };