import re

SKILL_TAXONOMY = {
    "frontend": [
    "react",
    "react.js",
    "next.js",
    "typescript",
    "javascript",
    "tailwind",
    "html",
    "css",
    "redux",
],
    "backend": [
    "python",
    "java",
    "fastapi",
    "node.js",
    "express",
    "rest api",
    "authentication",
    "authorization",
    "jwt",
    "postgresql",
    "mysql",
    "sql",
    "mongodb",
    "database design",
    "database optimization",
    "caching",
    "redis",
    "microservices",
    "docker",
    "backend development",
    "web services",
    "api development",
    "integration testing",
],
    "ai": [
    "machine learning",
    "deep learning",
    "computer vision",
    "nlp",
    "langchain",
    "rag",
    "embeddings",
    "vector search",
    "prompt engineering",
    "llm",
    "pytorch",
    "tensorflow",
    "scikit-learn",
    "pandas",
    "numpy",
    "classification",
    "regression",
    "clustering",
    "feature engineering",
    "data preprocessing",
    "model training",
    "model evaluation",
    "gemini",
    "gemini vision api",
    "sklearn",
    "opencv",
    "transformers",
    "distilbert",
    "bert",
],
    "computer_science": [
    "data structures",
    "algorithms",
    "dbms",
    "database management systems",
    "operating systems",
    "networking",
    "system design",
    "object oriented programming",
    "oop",
    "software engineering",
    "design patterns",
    "problem solving",
    "testing",
    "unit testing",
    "api design",
    "debugging",
    "code review",
    "software development",
    "object-oriented design",
],
    "cloud": [
        "aws",
        "s3",
        "cloudinary",
        "vercel",
        "railway",
        "render",
        "ci/cd",
        "kubernetes",
    ],
    "soft": [
        "communication",
        "leadership",
        "collaboration",
        "problem solving",
        "ownership",
        "mentoring",
    ],
    "tools": [
    "git",
    "github",
    "vscode",
    "intellij",
    "sap",
]
}

SKILL_ALIASES = {
    "oop": [
        "object oriented programming",
        "object-oriented programming",
        "oop"
    ],
    "dbms": [
        "dbms",
        "database management systems"
    ],
    "rest api": [
        "rest api",
        "restful api",
        "restful apis"
    ],
    "ci/cd": [
        "ci/cd",
        "continuous integration",
        "continuous deployment"
    ]
}

IMPLIED_SKILLS = {
    "fastapi": [
        "software development",
        "api design",
        "testing"
    ],
    "express": [
        "software development",
        "api design"
    ],
    "docker": [
        "deployment",
        "software development"
    ],
    "react": [
        "software development"
    ],
    "node.js": [
        "software development"
    ],
    "java": [
        "object oriented programming",
        "oop",
        "debugging"
    ],

    "software engineering": [
        "software development",
        "debugging"
    ],

    "data structures": [
        "algorithms"
    ]
}

ALL_SKILLS = sorted({skill for group in SKILL_TAXONOMY.values() for skill in group})


def extract_skills(text: str) -> list[str]:
    lower = text.lower()

    found = []

    for skill in ALL_SKILLS:
        if re.search(rf"\b{re.escape(skill.lower())}\b", lower):
            found.append(skill)

    return sorted(set(found))
