import Card from "../Card";
import CardHeader from "../CardHeader";
import CardBody from "../CardBody";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { colors } from "../../config/colors";

export default function AuthWrapper({
                                        children,
                                        title,
                                        Icon,
                                        iconColor,
                                        footerLink,
                                        footerText
                                    }) {
    return (
        <div className="min-h-screen flex items-center justify-center py-10" style={{ backgroundColor: colors.background }}>
            <Card className="max-w-md w-full" shadow="lg">
                <CardHeader align="center" borderBottom>
                    <Icon size={40} className="mx-auto mb-3" style={{ color: iconColor }} />
                    <h1 className="text-3xl font-bold" style={{ color: colors.secondary }}>
                        {title}
                    </h1>
                </CardHeader>

                <CardBody spacing="large">
                    {children}
                </CardBody>

                <div className="mt-4 pt-4 border-t text-center text-sm" style={{ borderColor: colors.accent2 + '30' }}>
                    <p className="text-gray-600">{footerText.preLink}{' '}
                        <Link to={footerLink.to} className="font-semibold hover:underline flex items-center justify-center gap-1 mt-2" style={{ color: footerLink.color }}>
                            {footerLink.Icon && <footerLink.Icon size={16} />}
                            {footerLink.text}
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}

AuthWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    Icon: PropTypes.elementType.isRequired,
    iconColor: PropTypes.string.isRequired,
    footerLink: PropTypes.shape({
        to: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        Icon: PropTypes.elementType,
        color: PropTypes.string,
    }).isRequired,
    footerText: PropTypes.shape({
        preLink: PropTypes.string.isRequired,
    }).isRequired,
};