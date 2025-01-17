import { array, boolean, mixed, number, object, string } from 'yup';

const getValidationSchema = (isCreate: boolean, pageNumber: number) => {
  const resumeSchema = isCreate
    ? mixed().required('A resume is required')
    : mixed();
  switch (pageNumber) {
    case 1:
      return object().shape({
        hacker: object().shape({
          application: object().shape({
            general: object().shape({
              school: string()
                .min(1, 'Select a school')
                .required('Required'),
              degree: string().required('Required'),
              fieldOfStudy: string().required('Required'),
              graduationYear: number()
                .required('Required')
                .min(2020, 'Graduation year must be 2020 or later')
                .max(2026, 'Graduation year must be between 2020 and 2026'),
            }),
          }),
        }),
      });

    case 2:
      return object().shape({
        hacker: object().shape({
          application: object().shape({
            general: object().shape({
              school: string()
                .min(1, 'Select a school')
                .required('Required'),
              degree: string().required('Required'),
              fieldOfStudy: string().required('Required'),
              graduationYear: number()
                .required('Required')
                .min(2020, 'Graduation year must be 2020 or later')
                .max(2026, 'Graduation year must be between 2020 and 2026'),
              jobInterest: string().required('Required'),
              URL: object().shape({
                resume: string(),
                github: string()
                  .url('Must be a valid URL')
                  .matches(/github.com\/\w+/, {
                    message: 'Must be a valid Github URL',
                    excludeEmptyString: true,
                  }),
                dribbble: string()
                  .url('Must be a valid URL')
                  .matches(/dribbble.com\/\w+/, {
                    message: 'Must be a valid Dribbble URL',
                    excludeEmptyString: true,
                  }),
                linkedIn: string()
                  .url('Must be a valid URL')
                  .matches(/linkedin.com\/in\/\w+/, {
                    message: 'Must be a valid LinkedIn URL',
                    excludeEmptyString: true,
                  }),
                personal: string().url('Must be a valid URL'),
                other: string().url('Must be a valid URL'),
              }),
            }),
            accommodation: object().shape({
              attendancePreference: string().required('Required'),
            }),
            other: object().shape({
              ethnicity: array().required('Required'),
            }),
          }),
        }),
        resume: resumeSchema
          .test(
            'fileSize',
            'File too large (<4MB only)',
            (value) => !value || value.length > 0 || value.size <= 4000000 // 4MB
          )
          .test(
            'fileFormat',
            'Unsupported Format (PDF only)',
            (value) =>
              !value || value.length > 0 || value.type === 'application/pdf'
          ),
      });
    case 3:
      return object().shape({
        hacker: object().shape({
          application: object().shape({
            general: object().shape({
              school: string()
                .min(1, 'Select a school')
                .required('Required'),
              degree: string().required('Required'),
              fieldOfStudy: string().required('Required'),
              graduationYear: number()
                .required('Required')
                .min(2020, 'Graduation year must be 2020 or later')
                .max(2026, 'Graduation year must be between 2020 and 2026'),
              jobInterest: string().required('Required'),
              URL: object().shape({
                resume: string(),
                github: string()
                  .url('Must be a valid URL')
                  .matches(/github.com\/\w+/, {
                    message: 'Must be a valid Github URL',
                    excludeEmptyString: true,
                  }),
                dribbble: string()
                  .url('Must be a valid URL')
                  .matches(/dribbble.com\/\w+/, {
                    message: 'Must be a valid Dribbble URL',
                    excludeEmptyString: true,
                  }),
                linkedIn: string()
                  .url('Must be a valid URL')
                  .matches(/linkedin.com\/in\/\w+/, {
                    message: 'Must be a valid LinkedIn URL',
                    excludeEmptyString: true,
                  }),
                personal: string().url('Must be a valid URL'),
                other: string().url('Must be a valid URL'),
              }),
            }),
            shortAnswer: object().shape({
              previousHackathons: number()
                .typeError('Required')
                .required('Required')
                .min(0, 'Must be between at least 0')
                .max(5, 'Must be at most 5'),
              question1: string()
                .required('Required')
                .test(
                  'length',
                  'At most 2000 characters',
                  (value) => value && value.length < 2000
                ),
              question2: string()
                .required('Required')
                .test(
                  'length',
                  'At most 2000 characters',
                  (value) => value && value.length < 2000
                ),
              comments: string().test(
                'length',
                'At most 500 characters',
                (value) => !value || value.length < 500
              ),
            }),
            accommodation: object().shape({
              attendancePreference: string().required('Required'),
            }),
            other: object().shape({
              ethnicity: array().required('Required'),
            }),
          }),
        }),
        resume: resumeSchema
          .test(
            'fileSize',
            'File too large (<4MB only)',
            (value) => !value || value.length > 0 || value.size <= 4000000 // 4MB
          )
          .test(
            'fileFormat',
            'Unsupported Format (PDF only)',
            (value) =>
              !value || value.length > 0 || value.type === 'application/pdf'
          ),
      });
    default:
      return object().shape({
        hacker: object().shape({
          application: object().shape({
            general: object().shape({
              school: string()
                .min(1, 'Select a school')
                .required('Required'),
              degree: string().required('Required'),
              fieldOfStudy: string().required('Required'),
              graduationYear: number()
                .required('Required')
                .min(2020, 'Graduation year must be 2020 or later')
                .max(2026, 'Graduation year must be between 2020 and 2026'),
              jobInterest: string().required('Required'),
              URL: object().shape({
                resume: string(),
                github: string()
                  .url('Must be a valid URL')
                  .matches(/github.com\/\w+/, {
                    message: 'Must be a valid Github URL',
                    excludeEmptyString: true,
                  }),
                dribbble: string()
                  .url('Must be a valid URL')
                  .matches(/dribbble.com\/\w+/, {
                    message: 'Must be a valid Dribbble URL',
                    excludeEmptyString: true,
                  }),
                linkedIn: string()
                  .url('Must be a valid URL')
                  .matches(/linkedin.com\/in\/\w+/, {
                    message: 'Must be a valid LinkedIn URL',
                    excludeEmptyString: true,
                  }),
                personal: string().url('Must be a valid URL'),
                other: string().url('Must be a valid URL'),
              }),
            }),
            shortAnswer: object().shape({
              previousHackathons: number()
                .typeError('Required')
                .required('Required')
                .min(0, 'Must be between at least 0')
                .max(5, 'Must be at most 5'),
              question1: string()
                .required('Required')
                .test(
                  'length',
                  'At most 2000 characters',
                  (value) => value && value.length < 2000
                ),
              question2: string()
                .required('Required')
                .test(
                  'length',
                  'At most 2000 characters',
                  (value) => value && value.length < 2000
                ),
              comments: string().test(
                'length',
                'At most 500 characters',
                (value) => !value || value.length < 500
              ),
            }),
            accommodation: object().shape({
              shirtSize: string().required('Required'),
              attendancePreference: string().required('Required'),
              impairments: string().test(
                'length',
                'At most 2000 characters',
                (value) => !value || value.length < 2000
              ),
              barriers: string().test(
                'length',
                'At most 2000 characters',
                (value) => !value || value.length < 2000
              ),
              travel: number()
                .min(0, 'Must be between 0 and 100')
                .max(100, 'Must be between 0 and 100')
                .integer('Must be an integer')
                .typeError('Must be a number'),
            }),
            other: object().shape({
              ethnicity: array().required('Required'),
              privacyPolicy: boolean()
                .required('Required')
                .test(
                  'true',
                  'You must accept the MLH policies',
                  (value) => value
                ),
              codeOfConduct: boolean()
                .required('Required')
                .test(
                  'true',
                  'You must accept the McHacks policies',
                  (value) => value
                ),
            }),
          }),
        }),
        resume: resumeSchema
          .test(
            'fileSize',
            'File too large (<4MB only)',
            (value) => !value || value.length > 0 || value.size <= 4000000 // 4MB
          )
          .test(
            'fileFormat',
            'Unsupported Format (PDF only)',
            (value) =>
              !value || value.length > 0 || value.type === 'application/pdf'
          ),
      });
  }
};

export default getValidationSchema;
